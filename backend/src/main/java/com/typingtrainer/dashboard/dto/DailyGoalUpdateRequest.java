package com.typingtrainer.dashboard.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record DailyGoalUpdateRequest(
        @Min(value = 1, message = "Daily goal must be at least 1 minute")
        @Max(value = 120, message = "Daily goal cannot exceed 120 minutes")
        int targetMinutes
) {}
