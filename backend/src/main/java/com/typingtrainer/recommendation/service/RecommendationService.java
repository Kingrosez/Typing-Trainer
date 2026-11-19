package com.typingtrainer.recommendation.service;

import com.typingtrainer.recommendation.dto.WeakKeyRecommendation;
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
    public static final int ROLLING_WINDOW_DAYS = 14;
    public static final double WEAK_ERROR_THRESHOLD = 8.0;

    private final KeyTelemetryRepository keyTelemetryRepository;

    public RecommendationService(KeyTelemetryRepository keyTelemetryRepository) {
        this.keyTelemetryRepository = keyTelemetryRepository;
    }

    /**
     * Evaluates key telemetry over trailing 14 calendar days.
     * Computes WPI = ErrorRate * ln(Opportunities + 1) for keys with Opportunities >= 20.
     * Classifies keys:
     * - Insufficient Data: < 20
     * - Mastered: <= 3%
     * - Stable: > 3% and <= 5%
     * - Developing: > 5% and <= 8%
     * - Weak: > 8%
     */
    public List<WeakKeyRecommendation> getRecommendations() {
        Instant cutoff = Instant.now().minus(Duration.ofDays(ROLLING_WINDOW_DAYS));
        List<KeyTelemetryRepository.KeySummaryProjection> summaries =
                keyTelemetryRepository.aggregateKeyTelemetrySince(cutoff);

        List<WeakKeyRecommendation> recommendations = new ArrayList<>();

        for (KeyTelemetryRepository.KeySummaryProjection s : summaries) {
            String key = s.getKeyChar();
            long opps = s.getTotalOpportunities() != null ? s.getTotalOpportunities() : 0;
            long errs = s.getTotalErrors() != null ? s.getTotalErrors() : 0;

            String tier = classifyKey(opps, errs);
            double errorRate = opps > 0 ? (errs * 100.0) / opps : 0.0;
            double accuracy = 100.0 - errorRate;
            double wpi = 0.0;

            if (opps >= MIN_OPPORTUNITIES) {
                // WPI_k = ErrRate_k * ln(O_k + 1)
                wpi = errorRate * Math.log(opps + 1.0);
            }

            String explanation = generateExplanation(key, opps, errs, errorRate, tier);

            recommendations.add(new WeakKeyRecommendation(
                    key,
                    Math.round(errorRate * 10.0) / 10.0,
                    Math.round(accuracy * 10.0) / 10.0,
                    opps,
                    errs,
                    Math.round(wpi * 10.0) / 10.0,
                    tier,
                    explanation
            ));
        }

        // Filter and sort top weak keys (tier == "Weak") descending by WPI
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
