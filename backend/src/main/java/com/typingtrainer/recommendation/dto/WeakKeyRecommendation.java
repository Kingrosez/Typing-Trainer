package com.typingtrainer.recommendation.dto;

public record WeakKeyRecommendation(
        String keyChar,
        double errorRate,
        double accuracy,
        long opportunities,
        long errors,
        double wpi,
        String tier,
        String explanation,
        int consecutiveCleanSessions,
        boolean isMastered
) {
    // Backward-compatible constructor
    public WeakKeyRecommendation(
            String keyChar,
            double errorRate,
            double accuracy,
            long opportunities,
            long errors,
            double wpi,
            String tier,
            String explanation
    ) {
        this(keyChar, errorRate, accuracy, opportunities, errors, wpi, tier, explanation, 0, "Mastered".equalsIgnoreCase(tier));
    }
}
