package com.typingtrainer.typing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TypingSessionSubmissionRequest(
        @NotBlank(message = "Session ID is required")
        String sessionId,

        @Min(value = 0, message = "Gross WPM must be non-negative")
        double grossWpm,

        @Min(value = 0, message = "Net WPM must be non-negative")
        double netWpm,

        @Min(value = 0, message = "Accuracy must be non-negative")
        double accuracy,

        @Min(value = 0, message = "Total errors must be non-negative")
        int totalErrors,

        @Min(value = 0, message = "Raw characters must be non-negative")
        int rawCharacters,

        @Min(value = 0, message = "Correct characters must be non-negative")
        int correctCharacters,

        @Min(value = 0, message = "Duration must be positive")
        double durationSeconds,

        @Size(max = 10000, message = "Passage must not exceed 10000 characters")
        String passage
) {}
