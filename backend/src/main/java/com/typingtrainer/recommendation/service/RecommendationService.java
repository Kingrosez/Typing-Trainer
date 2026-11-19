package com.typingtrainer.recommendation.service;

import com.typingtrainer.recommendation.dto.WeakKeyRecommendation;
import com.typingtrainer.telemetry.entity.KeyTelemetryEntity;
import com.typingtrainer.telemetry.repository.KeyTelemetryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class RecommendationService {

    public static final int MIN_OPPORTUNITIES = 20;
    public static final int MAX_EVALUATED_OPPORTUNITIES = 100;
    public static final int ROLLING_WINDOW_DAYS = 14;
    public static final double WEAK_ERROR_THRESHOLD = 8.0;

    private final KeyTelemetryRepository keyTelemetryRepository;

    public RecommendationService(KeyTelemetryRepository keyTelemetryRepository) {
        this.keyTelemetryRepository = keyTelemetryRepository;
    }

    /**
     * Evaluates key telemetry using the exact approved D6 specification:
     * - Most recent 100 eligible opportunities per key, subject to the maximum 14-calendar-day age limit.
     * - Minimum 20 eligible opportunities per key to qualify for ranking.
     * - WPI_k = ErrRate_k * ln(Opportunities_k + 1) where ErrRate_k is percentage (0 to 100).
     * - Five classifications:
     *   1. Insufficient Data: < 20 opportunities
     *   2. Mastered: <= 3.0%
     *   3. Stable: > 3.0% and <= 5.0%
     *   4. Developing: > 5.0% and <= 8.0%
     *   5. Weak Key: > 8.0%
     */
    public List<WeakKeyRecommendation> getRecommendations() {
        Instant cutoff = Instant.now().minus(Duration.ofDays(ROLLING_WINDOW_DAYS));
        List<String> distinctKeys = keyTelemetryRepository.findObservedKeysSince(cutoff);

        List<WeakKeyRecommendation> recommendations = new ArrayList<>();

        for (String key : distinctKeys) {
            List<KeyTelemetryEntity> keyEntries = keyTelemetryRepository.findRecentForKeySince(key, cutoff);

            // Accumulate up to the most recent 100 eligible opportunities
            long totalOpps = 0;
            long totalErrs = 0;

            for (KeyTelemetryEntity entry : keyEntries) {
                long needed = MAX_EVALUATED_OPPORTUNITIES - totalOpps;
                if (needed <= 0) break;

                long oppsToTake = Math.min(entry.getOpportunities(), needed);
                // Pro-rate errors proportionally if taking a slice of the entry
                long errsToTake = entry.getOpportunities() > 0
                        ? Math.round(((double) entry.getErrors() * oppsToTake) / entry.getOpportunities())
                        : 0;

                totalOpps += oppsToTake;
                totalErrs += errsToTake;
            }

            String tier = classifyKey(totalOpps, totalErrs);
            double errorRate = totalOpps > 0 ? (totalErrs * 100.0) / totalOpps : 0.0;
            double accuracy = 100.0 - errorRate;
            double wpi = 0.0;

            if (totalOpps >= MIN_OPPORTUNITIES && errorRate > WEAK_ERROR_THRESHOLD) {
                // WPI_k = ErrRate_k * ln(O_k + 1)
                wpi = errorRate * Math.log(totalOpps + 1.0);
            }

            String explanation = generateExplanation(key, totalOpps, totalErrs, errorRate, tier);

            recommendations.add(new WeakKeyRecommendation(
                    key,
                    Math.round(errorRate * 10.0) / 10.0,
                    Math.round(accuracy * 10.0) / 10.0,
                    totalOpps,
                    totalErrs,
                    Math.round(wpi * 10.0) / 10.0,
                    tier,
                    explanation
            ));
        }

        return recommendations.stream()
                .filter(r -> "Weak".equalsIgnoreCase(r.tier()))
                .sorted(Comparator.comparingDouble(WeakKeyRecommendation::wpi).reversed())
                .limit(3)
                .toList();
    }

    public String classifyKey(long opportunities, long errors) {
        if (opportunities < MIN_OPPORTUNITIES) {
            return "Insufficient Data";
        }
        double errRate = (errors * 100.0) / opportunities;
        if (errRate <= 3.0) {
            return "Mastered";
        } else if (errRate <= 5.0) {
            return "Stable";
        } else if (errRate <= 8.0) {
            return "Developing";
        } else {
            return "Weak";
        }
    }

    private String generateExplanation(String key, long opps, long errs, double errorRate, String tier) {
        if ("Insufficient Data".equalsIgnoreCase(tier)) {
            return "Target key '" + key + "' has fewer than 20 observations (" + opps + " strokes). Continue typing to build baseline accuracy.";
        }
        if ("Weak".equalsIgnoreCase(tier)) {
            return "Key '" + key + "' exhibits an elevated error rate (" + String.format("%.1f", errorRate) +
                    "%) across " + opps + " strokes. Dedicated 3-minute N-gram repetition recommended to isolate reach.";
        }
        if ("Developing".equalsIgnoreCase(tier)) {
            return "Key '" + key + "' shows moderate friction (" + String.format("%.1f", errorRate) +
                    "%). Finger dexterity is stabilizing.";
        }
        if ("Stable".equalsIgnoreCase(tier)) {
            return "Key '" + key + "' is stable with consistent accuracy (" + String.format("%.1f", errorRate) + "%).";
        }
        return "Key '" + key + "' is mastered with sub-3% error rate.";
    }
}
