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
        List<RecentSessionSummaryDto> recentSessions,
        WeakKeyOverviewDto weakKeyOverview
) {
    public DashboardSummaryResponse(
            UserStatusDto userStatus,
            DailyGoalDto dailyGoal,
            PrimaryMetricsDto primaryMetrics,
            List<WeeklyActivityDayDto> weeklyActivity,
            List<WpmTrendPointDto> wpmTrend,
            List<WeakKeyDto> weakKeyRecommendations,
            PersonalBestsDto personalBests,
            List<RecentSessionSummaryDto> recentSessions
    ) {
        this(userStatus, dailyGoal, primaryMetrics, weeklyActivity, wpmTrend, weakKeyRecommendations, personalBests, recentSessions, null);
    }
    public record UserStatusDto(
            String displayName,
            int currentLevel,
            String currentTier,
            int totalXp,
            int xpProgressInLevel,
            int xpRequiredForNextLevel,
            double levelProgressPercentage,
            int currentStreakDays,
            int longestStreakDays,
            int freezeShieldsAvailable
    ) {
        public UserStatusDto(
                String displayName,
                int currentLevel,
                String currentTier,
                int totalXp,
                int xpProgressInLevel,
                int xpRequiredForNextLevel,
                int currentStreakDays,
                int longestStreakDays,
                int freezeShieldsAvailable
        ) {
            this(
                    displayName,
                    currentLevel,
                    currentTier,
                    totalXp,
                    xpProgressInLevel,
                    xpRequiredForNextLevel,
                    xpRequiredForNextLevel > 0
                            ? Math.min(100.0, Math.round(((double) xpProgressInLevel / xpRequiredForNextLevel) * 1000.0) / 10.0)
                            : 0.0,
                    currentStreakDays,
                    longestStreakDays,
                    freezeShieldsAvailable
            );
        }
    }

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
            String explanation,
            int consecutiveCleanSessions,
            boolean isMastered
    ) {
        public WeakKeyDto(
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

    public record WeakKeyOverviewDto(
            String overallStatus, // INSUFFICIENT_DATA, WEAK, DEVELOPING, STABLE, MASTERED, NO_RECOMMENDATIONS
            String headline,
            String explanation,
            int weakKeyCount,
            int developingKeyCount,
            int stableKeyCount,
            int masteredKeyCount
    ) {}

    public record PersonalBestsDto(
            Double best15sWpm,
            Double best60sWpm,
            Double bestDevModeWpm,
            Double longestSessionSeconds,
            Double best15sAccuracy,
            Double best60sAccuracy,
            Double bestDevModeAccuracy,
            Double longestSessionAccuracy,
            String best15sDate,
            String best60sDate,
            String bestDevModeDate,
            String longestSessionDate
    ) {
        public PersonalBestsDto(
                Double best15sWpm,
                Double best60sWpm,
                Double bestDevModeWpm,
                Double longestSessionSeconds
        ) {
            this(best15sWpm, best60sWpm, bestDevModeWpm, longestSessionSeconds,
                    null, null, null, null, null, null, null, null);
        }
    }

    public record RecentSessionSummaryDto(
            String id,
            String sessionMode,
            double netWpm,
            double grossWpm,
            double accuracy,
            int totalErrors,
            double durationSeconds,
            int xpEarned,
            String completedAt,
            boolean isOfficialBenchmark
    ) {
        public RecentSessionSummaryDto(
                String id,
                String sessionMode,
                double netWpm,
                double grossWpm,
                double accuracy,
                int totalErrors,
                double durationSeconds,
                int xpEarned,
                String completedAt
        ) {
            this(id, sessionMode, netWpm, grossWpm, accuracy, totalErrors, durationSeconds, xpEarned, completedAt, false);
        }
    }
}
