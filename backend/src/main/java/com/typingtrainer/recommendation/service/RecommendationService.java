package com.typingtrainer.recommendation.service;

import com.typingtrainer.dashboard.dto.DashboardSummaryResponse.WeakKeyOverviewDto;
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
    public static final double DEVELOPING_ERROR_THRESHOLD = 5.0;
    public static final double STABLE_ERROR_THRESHOLD = 3.0;

    // D6 Multi-Session Mastery Gates
    public static final int QUALIFYING_SESSION_MIN_OPPORTUNITIES = 30;
    public static final double QUALIFYING_SESSION_MAX_ERROR_RATE = 3.0;
    public static final int REQUIRED_CONSECUTIVE_CLEAN_SESSIONS = 3;

    private final KeyTelemetryRepository keyTelemetryRepository;

    public RecommendationService(KeyTelemetryRepository keyTelemetryRepository) {
        this.keyTelemetryRepository = keyTelemetryRepository;
    }

    public record RecommendationAnalysis(
            WeakKeyOverviewDto overview,
            List<WeakKeyRecommendation> recommendations
    ) {}

    /**
     * Evaluates key telemetry using the exact approved D6 specification:
     * - Most recent 100 eligible opportunities per key, subject to the maximum 14-calendar-day age limit.
     * - Minimum 20 eligible opportunities per key to qualify for ranking.
     * - Error rate > 8%: Weak
     * - Error rate > 5% and <= 8%: Developing
     * - Error rate > 3% and <= 5%: Stable
     * - Error rate <= 3%: eligible for Mastered classification only after the 3-session mastery requirement.
     *   (3 distinct completed sessions with >= 30 opportunities each and <= 3.0% error rate).
     *   A key with <= 3% error rate without 3 qualifying clean sessions remains Stable.
     * - Authoritative classification into the 6 distinct dashboard states:
     *   1. INSUFFICIENT_DATA
     *   2. WEAK
     *   3. DEVELOPING
     *   4. STABLE
     *   5. MASTERED
     *   6. NO_RECOMMENDATIONS
     */
    public RecommendationAnalysis analyzeRecommendations() {
        Instant cutoff = Instant.now().minus(Duration.ofDays(ROLLING_WINDOW_DAYS));
        List<String> distinctKeys = keyTelemetryRepository.findObservedKeysSince(cutoff);

        List<WeakKeyRecommendation> allEvaluated = new ArrayList<>();
        int weakCount = 0;
        int developingCount = 0;
        int stableCount = 0;
        int masteredCount = 0;
        int evaluatedKeysWithMinOpportunities = 0;

        for (String key : distinctKeys) {
            List<KeyTelemetryEntity> keyEntries = keyTelemetryRepository.findRecentForKeySince(key, cutoff);

            // Accumulate up to the most recent 100 eligible opportunities in reverse chronological order
            long totalOpps = 0;
            long totalErrs = 0;

            for (KeyTelemetryEntity entry : keyEntries) {
                long needed = MAX_EVALUATED_OPPORTUNITIES - totalOpps;
                if (needed <= 0) break;

                long oppsToTake = Math.min(entry.getOpportunities(), needed);
                long errsToTake = entry.getOpportunities() > 0
                        ? Math.round(((double) entry.getErrors() * oppsToTake) / entry.getOpportunities())
                        : 0;

                totalOpps += oppsToTake;
                totalErrs += errsToTake;
            }

            // Calculate consecutive clean qualifying sessions for mastery gate
            // Session qualifies if O_session >= 30 and ErrRate_session <= 3.0%
            // Fails if O_session >= 30 and ErrRate_session > 3.0% (resets consecutive streak to 0)
            // Neutral if O_session < 30 (does not alter consecutive counter)
            int consecutiveCleanSessions = 0;
            for (KeyTelemetryEntity entry : keyEntries) {
                if (entry.getOpportunities() >= QUALIFYING_SESSION_MIN_OPPORTUNITIES) {
                    double sessionErrRate = (entry.getErrors() * 100.0) / entry.getOpportunities();
                    if (sessionErrRate <= QUALIFYING_SESSION_MAX_ERROR_RATE) {
                        consecutiveCleanSessions++;
                        if (consecutiveCleanSessions >= REQUIRED_CONSECUTIVE_CLEAN_SESSIONS) {
                            break;
                        }
                    } else {
                        // Consecutive streak broken by a qualifying session exceeding error threshold
                        break;
                    }
                }
            }

            boolean isMastered = consecutiveCleanSessions >= REQUIRED_CONSECUTIVE_CLEAN_SESSIONS;
            String tier = classifyKey(totalOpps, totalErrs, isMastered);
            double errorRate = totalOpps > 0 ? (totalErrs * 100.0) / totalOpps : 0.0;
            double accuracy = 100.0 - errorRate;
            double wpi = 0.0;

            if (totalOpps >= MIN_OPPORTUNITIES) {
                evaluatedKeysWithMinOpportunities++;
                if (errorRate > WEAK_ERROR_THRESHOLD) {
                    wpi = errorRate * Math.log(totalOpps + 1.0);
                }
            }

            if ("Weak".equalsIgnoreCase(tier)) weakCount++;
            else if ("Developing".equalsIgnoreCase(tier)) developingCount++;
            else if ("Stable".equalsIgnoreCase(tier)) stableCount++;
            else if ("Mastered".equalsIgnoreCase(tier)) masteredCount++;

            String explanation = generateExplanation(key, totalOpps, totalErrs, errorRate, tier, consecutiveCleanSessions);

            allEvaluated.add(new WeakKeyRecommendation(
                    key,
                    Math.round(errorRate * 10.0) / 10.0,
                    Math.round(accuracy * 10.0) / 10.0,
                    totalOpps,
                    totalErrs,
                    Math.round(wpi * 10.0) / 10.0,
                    tier,
                    explanation,
                    consecutiveCleanSessions,
                    isMastered
            ));
        }

        List<WeakKeyRecommendation> weakRecommendations = allEvaluated.stream()
                .filter(r -> "Weak".equalsIgnoreCase(r.tier()))
                .sorted(Comparator.comparingDouble(WeakKeyRecommendation::wpi).reversed())
                .limit(3)
                .toList();

        // Authoritative determination of overall status among the 6 distinct states
        String overallStatus;
        String headline;
        String explanation;

        if (distinctKeys.isEmpty() || evaluatedKeysWithMinOpportunities == 0) {
            overallStatus = "INSUFFICIENT_DATA";
            headline = "Algorithmic Weak-Key Remediation";
            explanation = "Insufficient telemetry to evaluate character friction. Minimum 20 eligible opportunities per character are required to cluster weak keys.";
        } else if (weakCount > 0) {
            overallStatus = "WEAK";
            headline = "Algorithmic Weak-Key Remediation";
            explanation = "Elevated friction detected on key reaches. Dedicated target-key drills recommended to restore motor cadence.";
        } else if (developingCount > 0) {
            overallStatus = "DEVELOPING";
            headline = "Dexterity Developing";
            explanation = "Moderate friction (5–8% error rate) detected. Finger dexterity is stabilizing across recent typing.";
        } else if (masteredCount > 0 && stableCount == 0) {
            overallStatus = "MASTERED";
            headline = "Flawless Precision 🌟";
            explanation = "Certified touch-typing mastery achieved! Consecutive clean qualifying sessions verified sub-3% error rate.";
        } else if (stableCount > 0) {
            overallStatus = "STABLE";
            headline = "Accuracy Stabilized";
            explanation = "Target keys maintain consistent accuracy (3–5% error rate). Complete qualifying clean drills (>= 30 strokes, <= 3% error) to achieve certified mastery.";
        } else {
            overallStatus = "NO_RECOMMENDATIONS";
            headline = "Optimal Performance";
            explanation = "No weak keys detected across your recent sessions. Your typing maintains balanced cadence and high accuracy.";
        }

        WeakKeyOverviewDto overview = new WeakKeyOverviewDto(
                overallStatus,
                headline,
                explanation,
                weakCount,
                developingCount,
                stableCount,
                masteredCount
        );

        return new RecommendationAnalysis(overview, weakRecommendations);
    }

    public List<WeakKeyRecommendation> getRecommendations() {
        return analyzeRecommendations().recommendations();
    }

    public String classifyKey(long opportunities, long errors, boolean hasThreeCleanSessions) {
        if (opportunities < MIN_OPPORTUNITIES) {
            return "Insufficient Data";
        }
        double errRate = (errors * 100.0) / opportunities;
        if (errRate <= STABLE_ERROR_THRESHOLD) {
            return hasThreeCleanSessions ? "Mastered" : "Stable";
        } else if (errRate <= DEVELOPING_ERROR_THRESHOLD) {
            return "Stable";
        } else if (errRate <= WEAK_ERROR_THRESHOLD) {
            return "Developing";
        } else {
            return "Weak";
        }
    }

    // Overload for backward compatibility
    public String classifyKey(long opportunities, long errors) {
        return classifyKey(opportunities, errors, false);
    }

    private String generateExplanation(String key, long opps, long errs, double errorRate, String tier, int consecutiveCleanSessions) {
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
            if (errorRate <= STABLE_ERROR_THRESHOLD) {
                return "Key '" + key + "' exhibits high accuracy (" + String.format("%.1f", errorRate) +
                        "%), with " + consecutiveCleanSessions + " of 3 qualifying clean sessions logged toward certified mastery.";
            }
            return "Key '" + key + "' is stable with consistent accuracy (" + String.format("%.1f", errorRate) + "%).";
        }
        return "Key '" + key + "' is mastered with sub-3% error rate across 3 consecutive qualifying clean drill sessions.";
    }
}
