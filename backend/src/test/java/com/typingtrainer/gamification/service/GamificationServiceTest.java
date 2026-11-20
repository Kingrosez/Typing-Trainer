package com.typingtrainer.gamification.service;

import com.typingtrainer.gamification.entity.UserGamificationEntity;
import com.typingtrainer.gamification.repository.UserGamificationRepository;
import com.typingtrainer.gamification.repository.UserRewardLedgerRepository;
import com.typingtrainer.profile.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamificationServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserGamificationRepository userGamificationRepository;

    @Mock
    private UserRewardLedgerRepository userRewardLedgerRepository;

    private GamificationService gamificationService;
    private final UUID testUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @BeforeEach
    void setUp() {
        gamificationService = new GamificationService(
                userProfileRepository,
                userGamificationRepository,
                userRewardLedgerRepository
        );
    }

    @Test
    @DisplayName("calculateBaseXp matches approved D5 formula: round(Words * 0.2) + round(ActiveMinutes * 5) with half-up rounding")
    void testCalculateBaseXpFormula() {
        // Example 1: 60 words (300 chars), 180 seconds (3 mins)
        // round(60 * 0.2) + round(3 * 5) = 12 + 15 = 27 XP
        int xp = gamificationService.calculateBaseXp(300, 180.0);
        assertThat(xp).isEqualTo(27);

        // Example 2: 120 words (600 chars), 240 seconds (4 mins)
        // round(120 * 0.2) + round(4 * 5) = 24 + 20 = 44 XP
        int xp2 = gamificationService.calculateBaseXp(600, 240.0);
        assertThat(xp2).isEqualTo(44);

        // Example 3: Non-integer fractions test half-up rounding
        // 53 words (265 chars) -> 53 * 0.2 = 10.6 -> rounds to 11
        // 75 seconds (1.25 mins) -> 1.25 * 5 = 6.25 -> rounds to 6
        // Total = 11 + 6 = 17 XP
        int xp3 = gamificationService.calculateBaseXp(265, 75.0);
        assertThat(xp3).isEqualTo(17);
    }

    @Test
    @DisplayName("getAccuracyMultiplier enforces approved brackets: 1.50x, 1.20x, 1.00x, 0.75x, 0.50x")
    void testAccuracyMultipliers() {
        assertThat(gamificationService.getAccuracyMultiplier(99.0)).isEqualTo(1.50);
        assertThat(gamificationService.getAccuracyMultiplier(98.0)).isEqualTo(1.50);
        assertThat(gamificationService.getAccuracyMultiplier(96.5)).isEqualTo(1.20);
        assertThat(gamificationService.getAccuracyMultiplier(92.0)).isEqualTo(1.00);
        assertThat(gamificationService.getAccuracyMultiplier(85.0)).isEqualTo(0.75);
        assertThat(gamificationService.getAccuracyMultiplier(75.0)).isEqualTo(0.50);
    }

    @Test
    @DisplayName("calculateAdjustedBaseXp applies accuracy multiplier with half-up rounding")
    void testCalculateAdjustedBaseXp() {
        // Base 27 XP with 96.5% Acc (1.20x) -> 27 * 1.20 = 32.4 -> 32 XP
        int adj1 = gamificationService.calculateAdjustedBaseXp(27, 96.5);
        assertThat(adj1).isEqualTo(32);

        // Base 33 XP with 98.2% Acc (1.50x) -> 33 * 1.50 = 49.5 -> rounds half-up to 50 XP
        int adj2 = gamificationService.calculateAdjustedBaseXp(33, 98.2);
        assertThat(adj2).isEqualTo(50);
    }

    @Test
    @DisplayName("applyDiminishingReturns enforces D5 schedule: 1-3 100%, 4-5 50%, 6+ 0%")
    void testDiminishingReturns() {
        int adjustedBase = 32;

        assertThat(gamificationService.applyDiminishingReturns(adjustedBase, 1)).isEqualTo(32);
        assertThat(gamificationService.applyDiminishingReturns(adjustedBase, 2)).isEqualTo(32);
        assertThat(gamificationService.applyDiminishingReturns(adjustedBase, 3)).isEqualTo(32);

        // Attempt 4: 50% of 32 = 16
        assertThat(gamificationService.applyDiminishingReturns(adjustedBase, 4)).isEqualTo(16);
        assertThat(gamificationService.applyDiminishingReturns(adjustedBase, 5)).isEqualTo(16);

        // Attempt 6+: 0 XP
        assertThat(gamificationService.applyDiminishingReturns(adjustedBase, 6)).isEqualTo(0);
        assertThat(gamificationService.applyDiminishingReturns(adjustedBase, 10)).isEqualTo(0);
    }

    @Test
    @DisplayName("calculateLevelFromXp maps accurately to quadratic curve and tier designations")
    void testLevelProgression() {
        assertThat(gamificationService.calculateLevelFromXp(0)).isEqualTo(1);
        assertThat(gamificationService.getTierForLevel(1)).isEqualTo("Novice");

        // Level 1 threshold: round(120 * 1^1.35) = 120
        int l1Threshold = gamificationService.getXpRequiredForNextLevel(1);
        assertThat(l1Threshold).isEqualTo(120);

        int lvlWith125 = gamificationService.calculateLevelFromXp(125);
        assertThat(lvlWith125).isEqualTo(2);

        assertThat(gamificationService.getTierForLevel(11)).isEqualTo("Apprentice");
        assertThat(gamificationService.getTierForLevel(21)).isEqualTo("Journeyman");
        assertThat(gamificationService.getTierForLevel(41)).isEqualTo("Touch Typist");
        assertThat(gamificationService.getTierForLevel(61)).isEqualTo("Keystroke Pro");
        assertThat(gamificationService.getTierForLevel(81)).isEqualTo("Grandmaster");
    }

    @Test
    @DisplayName("awardReward is idempotent: duplicate reward event IDs return false without adding XP")
    void testRewardIdempotency() {
        UserGamificationEntity mockGamification = new UserGamificationEntity(
                testUserId, 100, 1, "Novice", 0, 0, 0, null, null
        );
        when(userGamificationRepository.findById(testUserId)).thenReturn(Optional.of(mockGamification));
        when(userRewardLedgerRepository.findByRewardEventId("EVENT-001")).thenReturn(Optional.empty());

        boolean awardedFirst = gamificationService.awardReward(testUserId, "EVENT-001", "SESSION-001", "DAILY_GOAL", 150);
        assertThat(awardedFirst).isTrue();
        assertThat(mockGamification.getTotalXp()).isEqualTo(250);

        when(userRewardLedgerRepository.findByRewardEventId("EVENT-001"))
                .thenReturn(Optional.of(mock(com.typingtrainer.gamification.entity.UserRewardLedgerEntity.class)));

        boolean awardedSecond = gamificationService.awardReward(testUserId, "EVENT-001", "SESSION-001", "DAILY_GOAL", 150);
        assertThat(awardedSecond).isFalse();
        assertThat(mockGamification.getTotalXp()).isEqualTo(250);
    }

    @Test
    @DisplayName("evaluateDailyStreak advances streak and awards 1 freeze shield every 7 days (max 2)")
    void testDailyStreakProgressionAndFreezeShields() {
        UserGamificationEntity gamification = new UserGamificationEntity(
                testUserId, 0, 1, "Novice", 6, 6, 0, "2026-11-18", null
        );
        when(userGamificationRepository.findById(testUserId)).thenReturn(Optional.of(gamification));

        LocalDate day7 = LocalDate.of(2026, 11, 19);
        gamificationService.evaluateDailyStreak(testUserId, day7, true);

        assertThat(gamification.getCurrentStreakDays()).isEqualTo(7);
        assertThat(gamification.getFreezeShieldsAvailable()).isEqualTo(1);
    }

    @Test
    @DisplayName("checkAndAwardDailyGoalBonus: awards 150 XP once per calendar day and rejects duplicates")
    void testCheckAndAwardDailyGoalBonusAwardsOncePerDay() {
        UserGamificationEntity gamification = new UserGamificationEntity(
                testUserId, 100, 1, "Novice", 0, 0, 0, null, null
        );
        when(userGamificationRepository.findById(testUserId)).thenReturn(Optional.of(gamification));

        LocalDate today = LocalDate.of(2026, 11, 20);
        String expectedEventId = "DAILY_GOAL_" + testUserId + "_" + today;

        // First attempt: Not in ledger yet
        when(userRewardLedgerRepository.findByRewardEventId(expectedEventId)).thenReturn(Optional.empty());

        boolean firstAward = gamificationService.checkAndAwardDailyGoalBonus(testUserId, today, 1200, 20);
        assertThat(firstAward).isTrue();
        assertThat(gamification.getTotalXp()).isEqualTo(250); // 100 + 150 XP

        // Second attempt on the same day: Already in ledger
        when(userRewardLedgerRepository.findByRewardEventId(expectedEventId))
                .thenReturn(Optional.of(mock(com.typingtrainer.gamification.entity.UserRewardLedgerEntity.class)));

        boolean secondAward = gamificationService.checkAndAwardDailyGoalBonus(testUserId, today, 1500, 20);
        assertThat(secondAward).isFalse();
        assertThat(gamification.getTotalXp()).isEqualTo(250); // XP remains unchanged
    }

    @Test
    @DisplayName("hasDailyGoalBonusBeenAwarded: reflects presence in user_reward_ledger accurately")
    void testHasDailyGoalBonusBeenAwarded() {
        LocalDate today = LocalDate.of(2026, 11, 20);
        String eventId = "DAILY_GOAL_" + testUserId + "_" + today;

        when(userRewardLedgerRepository.findByRewardEventId(eventId)).thenReturn(Optional.empty());
        assertThat(gamificationService.hasDailyGoalBonusBeenAwarded(testUserId, today)).isFalse();

        when(userRewardLedgerRepository.findByRewardEventId(eventId))
                .thenReturn(Optional.of(mock(com.typingtrainer.gamification.entity.UserRewardLedgerEntity.class)));
        assertThat(gamificationService.hasDailyGoalBonusBeenAwarded(testUserId, today)).isTrue();
    }
}
