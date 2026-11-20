package com.typingtrainer.dashboard.service;

import com.typingtrainer.dashboard.dto.DailyGoalUpdateRequest;
import com.typingtrainer.dashboard.dto.DashboardSummaryResponse;
import com.typingtrainer.dashboard.dto.DashboardSummaryResponse.*;
import com.typingtrainer.gamification.entity.UserGamificationEntity;
import com.typingtrainer.gamification.service.GamificationService;
import com.typingtrainer.profile.entity.UserProfileEntity;
import com.typingtrainer.profile.repository.UserProfileRepository;
import com.typingtrainer.recommendation.dto.WeakKeyRecommendation;
import com.typingtrainer.recommendation.service.RecommendationService;
import com.typingtrainer.typing.entity.TypingSessionEntity;
import com.typingtrainer.typing.repository.TypingSessionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@Transactional
public class DashboardService {

    public static final String DAILY_GOAL_SETTING_KEY = "daily_practice_goal_minutes";
    public static final int DEFAULT_DAILY_GOAL_MINUTES = 20;

    private final TypingSessionRepository typingSessionRepository;
    private final UserProfileRepository userProfileRepository;
    private final GamificationService gamificationService;
    private final RecommendationService recommendationService;

    // In-memory setting cache or user setting fallback
    private int dailyGoalMinutes = DEFAULT_DAILY_GOAL_MINUTES;

    public DashboardService(TypingSessionRepository typingSessionRepository,
                            UserProfileRepository userProfileRepository,
                            GamificationService gamificationService,
                            RecommendationService recommendationService) {
        this.typingSessionRepository = typingSessionRepository;
        this.userProfileRepository = userProfileRepository;
        this.gamificationService = gamificationService;
        this.recommendationService = recommendationService;
    }

    public DashboardSummaryResponse getDashboardSummary(ZoneId clientZone) {
        UUID userId = GamificationService.DEFAULT_USER_ID;

        // 1. User & Gamification Status
        UserGamificationEntity gamification = gamificationService.getOrCreateGamification(userId);
        UserProfileEntity profile = userProfileRepository.findById(userId)
                .orElse(new UserProfileEntity(userId, "Typist", Instant.now(), Instant.now()));

        int totalXp = gamification.getTotalXp();
        int currentLevel = gamification.getCurrentLevel();
        String currentTier = gamification.getCurrentTier();
        int xpProgress = gamificationService.getXpProgressInCurrentLevel(totalXp, currentLevel);
        int xpRequiredNext = gamificationService.getXpRequiredForNextLevel(currentLevel);

        UserStatusDto userStatus = new UserStatusDto(
                profile.getDisplayName(),
                currentLevel,
                currentTier,
                totalXp,
                xpProgress,
                xpRequiredNext,
                gamification.getCurrentStreakDays(),
                gamification.getLongestStreakDays(),
                gamification.getFreezeShieldsAvailable()
        );

        // 2. Daily Practice Goal
        LocalDate today = LocalDate.now(clientZone);
        Instant startOfDay = today.atStartOfDay(clientZone).toInstant();
        List<TypingSessionEntity> todaySessions = typingSessionRepository.findSessionsSince(startOfDay);

        double completedSecondsToday = todaySessions.stream()
                .mapToDouble(TypingSessionEntity::getDurationSeconds)
                .sum();

        int targetSeconds = dailyGoalMinutes * 60;
        int remainingSeconds = (int) Math.max(0, targetSeconds - completedSecondsToday);
        double progressPercentage = Math.min(100.0, (completedSecondsToday / targetSeconds) * 100.0);

        // Daily goal bonus is awarded idempotently; isCompletedToday is true ONLY after
        // confirming successful ledger record in user_reward_ledger
        boolean isGoalMetToday = false;
        if (completedSecondsToday >= targetSeconds) {
            try {
                gamificationService.checkAndAwardDailyGoalBonus(userId, today, completedSecondsToday, dailyGoalMinutes);
                gamificationService.evaluateDailyStreak(userId, today, true);
                isGoalMetToday = gamificationService.hasDailyGoalBonusBeenAwarded(userId, today);
            } catch (Exception e) {
                isGoalMetToday = false;
            }
        }

        DailyGoalDto dailyGoal = new DailyGoalDto(
                dailyGoalMinutes,
                (int) Math.round(completedSecondsToday),
                remainingSeconds,
                Math.round(progressPercentage * 10.0) / 10.0,
                isGoalMetToday
        );

        // 3. Primary Metrics (Trailing 30 mean, Best 60s WPM, Accuracy, Duration, Completed count)
        long totalSessions = typingSessionRepository.count();
        List<TypingSessionEntity> trailing30 = typingSessionRepository.findRecentSessions(PageRequest.of(0, 30));

        Double averageWpm = null;
        if (!trailing30.isEmpty()) {
            double avg = trailing30.stream().mapToDouble(TypingSessionEntity::getNetWpm).average().orElse(0.0);
            averageWpm = Math.round(avg * 10.0) / 10.0;
        }

        List<TypingSessionEntity> top60s = typingSessionRepository.findTopBenchmark(60, 95.0, PageRequest.of(0, 1));
        Double bestWpm = top60s.isEmpty() ? null : Math.round(top60s.get(0).getNetWpm() * 10.0) / 10.0;

        Double overallAccuracy = null;
        Long correctChars = typingSessionRepository.sumCorrectCharacters();
        Long rawChars = typingSessionRepository.sumRawCharacters();
        if (rawChars != null && rawChars > 0 && correctChars != null) {
            double acc = (correctChars * 100.0) / rawChars;
            overallAccuracy = Math.round(acc * 10.0) / 10.0;
        }

        Double totalDuration = typingSessionRepository.sumTotalDurationSeconds();
        double practiceSeconds = totalDuration != null ? totalDuration : 0.0;

        Double currentSessionWpm = trailing30.isEmpty() ? null : Math.round(trailing30.get(0).getNetWpm() * 10.0) / 10.0;

        PrimaryMetricsDto primaryMetrics = new PrimaryMetricsDto(
                bestWpm,
                averageWpm,
                overallAccuracy,
                practiceSeconds,
                totalSessions,
                currentSessionWpm
        );

        // 4. Weekly Activity (Monday-to-Sunday for current local week)
        List<WeeklyActivityDayDto> weeklyActivity = new ArrayList<>();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        for (int i = 0; i < 7; i++) {
            LocalDate day = monday.plusDays(i);
            Instant dayStart = day.atStartOfDay(clientZone).toInstant();
            Instant dayEnd = day.plusDays(1).atStartOfDay(clientZone).toInstant();

            List<TypingSessionEntity> daySessions = typingSessionRepository.findSessionsSince(dayStart);
            double daySecs = daySessions.stream()
                    .filter(s -> s.getCompletedAt().isBefore(dayEnd))
                    .mapToDouble(TypingSessionEntity::getDurationSeconds)
                    .sum();

            boolean met = daySecs >= targetSeconds;
            weeklyActivity.add(new WeeklyActivityDayDto(
                    day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    day.toString(),
                    (int) Math.round(daySecs),
                    met,
                    day.equals(today)
            ));
        }

        // 5. WPM Trend Curve (Trailing 15 completed sessions)
        List<TypingSessionEntity> trailing15 = typingSessionRepository.findRecentSessions(PageRequest.of(0, 15));
        List<WpmTrendPointDto> wpmTrend = trailing15.stream()
                .sorted(Comparator.comparing(TypingSessionEntity::getCompletedAt))
                .map(s -> new WpmTrendPointDto(
                        s.getId().toString(),
                        s.getNetWpm(),
                        s.getGrossWpm(),
                        s.getAccuracy(),
                        s.getTotalErrors(),
                        s.getCompletedAt().toString()
                ))
                .toList();

        // 6. Weak-Key Recommendations & Authoritative D6 Overview
        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();
        List<WeakKeyDto> weakKeys = analysis.recommendations().stream()
                .map(w -> new WeakKeyDto(
                        w.keyChar(),
                        w.errorRate(),
                        w.accuracy(),
                        w.opportunities(),
                        w.errors(),
                        w.wpi(),
                        w.tier(),
                        w.explanation(),
                        w.consecutiveCleanSessions(),
                        w.isMastered()
                ))
                .toList();
        WeakKeyOverviewDto weakKeyOverview = analysis.overview();

        // 7. Personal Bests (15s, 60s, DevMode, Longest session)
        List<TypingSessionEntity> top15s = typingSessionRepository.findTopBenchmark(15, 95.0, PageRequest.of(0, 1));
        Double best15s = top15s.isEmpty() ? null : Math.round(top15s.get(0).getNetWpm() * 10.0) / 10.0;

        List<TypingSessionEntity> topDev = typingSessionRepository.findTopByMode("DEVELOPER_MODE", 95.0, PageRequest.of(0, 1));
        Double bestDev = topDev.isEmpty() ? null : Math.round(topDev.get(0).getNetWpm() * 10.0) / 10.0;

        List<TypingSessionEntity> longest = typingSessionRepository.findLongestSession(PageRequest.of(0, 1));
        Double longestSecs = longest.isEmpty() ? null : Math.round(longest.get(0).getDurationSeconds() * 10.0) / 10.0;

        PersonalBestsDto personalBests = new PersonalBestsDto(
                best15s,
                bestWpm, // best 60s
                bestDev,
                longestSecs
        );

        // 8. Recent Sessions Log (Last 5)
        List<TypingSessionEntity> recent5 = typingSessionRepository.findRecentSessions(PageRequest.of(0, 5));
        List<RecentSessionSummaryDto> recentSessions = recent5.stream()
                .map(s -> new RecentSessionSummaryDto(
                        s.getId().toString(),
                        s.getSessionMode(),
                        s.getNetWpm(),
                        s.getGrossWpm(),
                        s.getAccuracy(),
                        s.getTotalErrors(),
                        s.getDurationSeconds(),
                        s.getXpEarned(),
                        s.getCompletedAt().toString()
                ))
                .toList();

        return new DashboardSummaryResponse(
                userStatus,
                dailyGoal,
                primaryMetrics,
                weeklyActivity,
                wpmTrend,
                weakKeys,
                personalBests,
                recentSessions,
                weakKeyOverview
        );
    }

    public DailyGoalDto updateDailyGoal(DailyGoalUpdateRequest request, ZoneId clientZone) {
        this.dailyGoalMinutes = request.targetMinutes();
        LocalDate today = LocalDate.now(clientZone);
        Instant startOfDay = today.atStartOfDay(clientZone).toInstant();
        List<TypingSessionEntity> todaySessions = typingSessionRepository.findSessionsSince(startOfDay);

        double completedSecondsToday = todaySessions.stream()
                .mapToDouble(TypingSessionEntity::getDurationSeconds)
                .sum();

        int targetSeconds = dailyGoalMinutes * 60;
        int remainingSeconds = (int) Math.max(0, targetSeconds - completedSecondsToday);
        double progressPercentage = Math.min(100.0, (completedSecondsToday / targetSeconds) * 100.0);

        boolean isGoalMet = false;
        if (completedSecondsToday >= targetSeconds) {
            try {
                gamificationService.checkAndAwardDailyGoalBonus(GamificationService.DEFAULT_USER_ID, today, completedSecondsToday, dailyGoalMinutes);
                isGoalMet = gamificationService.hasDailyGoalBonusBeenAwarded(GamificationService.DEFAULT_USER_ID, today);
            } catch (Exception e) {
                isGoalMet = false;
            }
        }

        return new DailyGoalDto(
                dailyGoalMinutes,
                (int) Math.round(completedSecondsToday),
                remainingSeconds,
                Math.round(progressPercentage * 10.0) / 10.0,
                isGoalMet
        );
    }
}
