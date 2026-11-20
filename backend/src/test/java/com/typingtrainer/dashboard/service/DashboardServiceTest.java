package com.typingtrainer.dashboard.service;

import com.typingtrainer.dashboard.dto.DashboardSummaryResponse;
import com.typingtrainer.dashboard.dto.DashboardSummaryResponse.WeeklyActivityDayDto;
import com.typingtrainer.gamification.entity.UserGamificationEntity;
import com.typingtrainer.gamification.service.GamificationService;
import com.typingtrainer.profile.entity.UserProfileEntity;
import com.typingtrainer.profile.repository.UserProfileRepository;
import com.typingtrainer.recommendation.service.RecommendationService;
import com.typingtrainer.typing.entity.TypingSessionEntity;
import com.typingtrainer.typing.repository.TypingSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.time.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private TypingSessionRepository typingSessionRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private GamificationService gamificationService;

    @Mock
    private RecommendationService recommendationService;

    private DashboardService dashboardService;

    private final UUID userId = GamificationService.DEFAULT_USER_ID;

    @BeforeEach
    void setUp() {
        dashboardService = new DashboardService(
                typingSessionRepository,
                userProfileRepository,
                gamificationService,
                recommendationService
        );

        UserGamificationEntity mockGamification = new UserGamificationEntity(
                userId, 2450, 12, "Apprentice", 5, 14, 2, "2026-11-19", Instant.now()
        );
        lenient().when(gamificationService.getOrCreateGamification(userId)).thenReturn(mockGamification);
        lenient().when(userProfileRepository.findById(userId)).thenReturn(
                Optional.of(new UserProfileEntity(userId, "Alex", Instant.now(), Instant.now()))
        );
        lenient().when(recommendationService.analyzeRecommendations()).thenReturn(
                new RecommendationService.RecommendationAnalysis(
                        new DashboardSummaryResponse.WeakKeyOverviewDto("NO_RECOMMENDATIONS", "Optimal Performance", "No weak keys detected.", 0, 0, 0, 0),
                        List.of()
                )
        );
    }

    @Test
    @DisplayName("W-04 Weekly Activity: Groups strictly Monday-to-Sunday with correct week boundaries")
    void testWeeklyActivityMondayToSundayGrouping() {
        ZoneId zone = ZoneId.of("UTC");
        DashboardSummaryResponse response = dashboardService.getDashboardSummary(zone);

        List<WeeklyActivityDayDto> weekly = response.weeklyActivity();
        assertThat(weekly).hasSize(7);

        // Days must be Mon, Tue, Wed, Thu, Fri, Sat, Sun
        assertThat(weekly.get(0).dayOfWeek()).isEqualTo("Mon");
        assertThat(weekly.get(1).dayOfWeek()).isEqualTo("Tue");
        assertThat(weekly.get(2).dayOfWeek()).isEqualTo("Wed");
        assertThat(weekly.get(3).dayOfWeek()).isEqualTo("Thu");
        assertThat(weekly.get(4).dayOfWeek()).isEqualTo("Fri");
        assertThat(weekly.get(5).dayOfWeek()).isEqualTo("Sat");
        assertThat(weekly.get(6).dayOfWeek()).isEqualTo("Sun");

        // Exactly one day must be flagged as today
        long todayCount = weekly.stream().filter(WeeklyActivityDayDto::isToday).count();
        assertThat(todayCount).isEqualTo(1);
    }

    @Test
    @DisplayName("W-04 Weekly Activity: Handles timezone boundaries correctly using clientZone")
    void testWeeklyActivityTimezoneBoundaries() {
        ZoneId nyZone = ZoneId.of("America/New_York");
        LocalDate todayInNy = LocalDate.now(nyZone);

        // Session completed at 11:30 PM New York time on today
        Instant sessionTime = todayInNy.atTime(23, 30).atZone(nyZone).toInstant();
        TypingSessionEntity lateSession = new TypingSessionEntity(
                UUID.randomUUID(), 65.0, 60.0, 96.0, 2, 300, 290, 600.0, "Test", sessionTime, "TYPING_TEST", 60, true, 50
        );

        when(typingSessionRepository.findSessionsSince(any(Instant.class))).thenReturn(List.of(lateSession));

        DashboardSummaryResponse response = dashboardService.getDashboardSummary(nyZone);
        WeeklyActivityDayDto todayDay = response.weeklyActivity().stream()
                .filter(WeeklyActivityDayDto::isToday)
                .findFirst()
                .orElseThrow();

        assertThat(todayDay.durationSeconds()).isEqualTo(600);
    }

    @Test
    @DisplayName("Daily Goal: isCompletedToday is true when ledger transaction succeeds")
    void testDailyGoalCompletionWhenLedgerConfirms() {
        ZoneId zone = ZoneId.of("UTC");

        // User typed 1500 seconds (25 minutes) with a 20-minute target (1200 seconds)
        TypingSessionEntity session = new TypingSessionEntity(
                UUID.randomUUID(), 65.0, 60.0, 96.0, 2, 300, 290, 1500.0, "Test", Instant.now(), "TYPING_TEST", 60, true, 50
        );
        when(typingSessionRepository.findSessionsSince(any(Instant.class))).thenReturn(List.of(session));
        when(gamificationService.hasDailyGoalBonusBeenAwarded(eq(userId), any(LocalDate.class))).thenReturn(true);

        DashboardSummaryResponse responseSuccess = dashboardService.getDashboardSummary(zone);
        assertThat(responseSuccess.dailyGoal().isCompletedToday()).isTrue();
    }

    @Test
    @DisplayName("Daily Goal: isCompletedToday is false when reward transaction fails")
    void testDailyGoalCompletionWhenRewardTransactionFails() {
        ZoneId zone = ZoneId.of("UTC");

        TypingSessionEntity session = new TypingSessionEntity(
                UUID.randomUUID(), 65.0, 60.0, 96.0, 2, 300, 290, 1500.0, "Test", Instant.now(), "TYPING_TEST", 60, true, 50
        );
        when(typingSessionRepository.findSessionsSince(any(Instant.class))).thenReturn(List.of(session));
        when(gamificationService.checkAndAwardDailyGoalBonus(eq(userId), any(LocalDate.class), anyDouble(), anyInt()))
                .thenThrow(new RuntimeException("Database lock error"));

        DashboardSummaryResponse responseFailed = dashboardService.getDashboardSummary(zone);
        assertThat(responseFailed.dailyGoal().isCompletedToday()).isFalse();
    }

    @Test
    @DisplayName("W-05 WPM Trend: Returns up to 15 sessions in chronological order")
    void testWpmTrendChronologicalOrder() {
        Instant t1 = Instant.parse("2026-11-20T10:00:00Z");
        Instant t2 = Instant.parse("2026-11-20T12:00:00Z");

        TypingSessionEntity s1 = new TypingSessionEntity(UUID.randomUUID(), 60.0, 58.0, 97.0, 1, 200, 195, 60.0, "P", t1, "TEST", 60, true, 40);
        TypingSessionEntity s2 = new TypingSessionEntity(UUID.randomUUID(), 65.0, 62.0, 98.0, 0, 210, 208, 60.0, "P", t2, "TEST", 60, true, 45);

        // findRecentSessions returns in reverse order (s2, s1)
        when(typingSessionRepository.findRecentSessions(any(Pageable.class))).thenReturn(List.of(s2, s1));

        DashboardSummaryResponse response = dashboardService.getDashboardSummary(ZoneId.of("UTC"));

        // WPM trend should sort chronologically (s1 then s2)
        assertThat(response.wpmTrend()).hasSize(2);
        assertThat(response.wpmTrend().get(0).netWpm()).isEqualTo(58.0);
        assertThat(response.wpmTrend().get(1).netWpm()).isEqualTo(62.0);
    }
}
