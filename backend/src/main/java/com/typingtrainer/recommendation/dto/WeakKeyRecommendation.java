package com.typingtrainer.recommendation.dto;

public record WeakKeyRecommendation(
        String keyChar,
        double errorRate,
        double accuracy,
        long opportunities,
        long errors,
        double wpi,
        String tier,
        String explanation
) {}
