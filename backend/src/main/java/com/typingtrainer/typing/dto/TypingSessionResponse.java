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
        Instant completedAt,
        String sessionMode,
        int xpEarned,
        boolean isOfficialBenchmark
) {
    public TypingSessionResponse(
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
    ) {
        this(id, grossWpm, netWpm, accuracy, totalErrors, rawCharacters, correctCharacters,
                durationSeconds, passage, completedAt, "TYPING_TEST", 0, false);
    }
}