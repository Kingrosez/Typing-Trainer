package com.typingtrainer.typing.dto;

import java.time.Instant;

public record TypingSessionResponse(
        String id,
        double grossWpm,
        double netWpm,
        double accuracy,
        int totalErrors,
        int rawCharacters,
        int correctCharacters,
        double durationSeconds,
        String passage,
        Instant completedAt
) {}