package com.typingtrainer.dashboard.dto;

import java.util.List;

public record DashboardSummaryResponse(
        UserStatusDto userStatus,
        DailyGoalDto dailyGoal,
        PrimaryMetricsDto primaryMetrics,
        List<WeeklyActivityDayDto> weeklyActivity,
        List<WpmTrendPointDto> wpmTrend,
        List<WeakKeyDto> weakKeyRecommendations,
        PersonalBestsDto personalBests,
        List<RecentSessionSummaryDto> recentSessions
) {
    public record UserStatusDto(
            String displayName,
            int currentLevel,
            String currentTier,
            int totalXp,
            int xpProgressInLevel,
            int xpRequiredForNextLevel,
            int currentStreakDays,
            int longestStreakDays,
            int freezeShieldsAvailable
    ) {}

    public record DailyGoalDto(
            int targetMinutes,
            int completedSecondsToday,
            int remainingSecondsToday,
            double progressPercentage,
            boolean isCompletedToday
    ) {}

    public record PrimaryMetricsDto(
            Double bestWpm,
            Double averageWpm,
            Double accuracy,
            double totalPracticeSeconds,
            long completedSessionCount,
            Double currentSessionWpm
    ) {}

    public record WeeklyActivityDayDto(
            String dayOfWeek,     // "Mon", "Tue", etc.
            String date,          // "YYYY-MM-DD"
            int durationSeconds,
            boolean goalMet,
            boolean isToday
    ) {}

    public record WpmTrendPointDto(
            String sessionId,
            double netWpm,
            double grossWpm,
            double accuracy,
            int totalErrors,
            String completedAt
    ) {}

    public record WeakKeyDto(
            String keyChar,
            double errorRate,
            double accuracy,
            long opportunities,
            long errors,
            double wpi,
            String tier,
            String explanation
    ) {}

    public record PersonalBestsDto(
            Double best15sWpm,
            Double best60sWpm,
            Double bestDevModeWpm,
            Double longestSessionSeconds
    ) {}

    public record RecentSessionSummaryDto(
            String id,
            String sessionMode,
            double netWpm,
            double grossWpm,
            double accuracy,
            int totalErrors,
            double durationSeconds,
            int xpEarned,
            String completedAt
    ) {}
}
