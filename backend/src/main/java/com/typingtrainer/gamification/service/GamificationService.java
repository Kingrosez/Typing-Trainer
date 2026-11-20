package com.typingtrainer.gamification.service;

import com.typingtrainer.gamification.entity.UserGamificationEntity;
import com.typingtrainer.gamification.entity.UserRewardLedgerEntity;
import com.typingtrainer.gamification.repository.UserGamificationRepository;
import com.typingtrainer.gamification.repository.UserRewardLedgerRepository;
import com.typingtrainer.profile.entity.UserProfileEntity;
import com.typingtrainer.profile.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Transactional
public class GamificationService {

    public static final UUID DEFAULT_USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    public static final int DAILY_GOAL_BONUS_XP = 150;
    public static final int MAX_FREEZE_SHIELDS = 2;

    private final UserProfileRepository userProfileRepository;
    private final UserGamificationRepository userGamificationRepository;
    private final UserRewardLedgerRepository userRewardLedgerRepository;

    public GamificationService(UserProfileRepository userProfileRepository,
                               UserGamificationRepository userGamificationRepository,
                               UserRewardLedgerRepository userRewardLedgerRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userGamificationRepository = userGamificationRepository;
        this.userRewardLedgerRepository = userRewardLedgerRepository;
    }

    public UserGamificationEntity getOrCreateGamification(UUID userId) {
        return userGamificationRepository.findById(userId).orElseGet(() -> {
            userProfileRepository.findById(userId).orElseGet(() -> {
                UserProfileEntity newProfile = new UserProfileEntity(userId, "Typist", Instant.now(), Instant.now());
                return userProfileRepository.save(newProfile);
            });

            UserGamificationEntity initial = new UserGamificationEntity(
                    userId,
                    0,               // totalXp
                    1,               // currentLevel
                    "Novice",        // currentTier
                    0,               // currentStreakDays
                    0,               // longestStreakDays
                    0,               // freezeShieldsAvailable
                    null,            // lastPracticeDate
                    Instant.now()
            );
            return userGamificationRepository.save(initial);
        });
    }

    /**
     * Calculates deterministic Base Effort XP according to D5:
     * XP_base = round(WordsTyped * 0.2) + round(ActiveMinutes * 5)
     * WordsTyped is correctCharacters / 5.0.
     * Rounding: Word component and active-minute component are rounded separately using half-up rounding.
     */
    public int calculateBaseXp(int correctCharacters, double activeSeconds) {
        BigDecimal wordsTyped = BigDecimal.valueOf(correctCharacters)
                .divide(BigDecimal.valueOf(5.0), 6, RoundingMode.HALF_UP);
        BigDecimal wordComponent = wordsTyped.multiply(BigDecimal.valueOf(0.2))
                .setScale(0, RoundingMode.HALF_UP);

        BigDecimal activeMinutes = BigDecimal.valueOf(activeSeconds)
                .divide(BigDecimal.valueOf(60.0), 6, RoundingMode.HALF_UP);
        BigDecimal timeComponent = activeMinutes.multiply(BigDecimal.valueOf(5.0))
                .setScale(0, RoundingMode.HALF_UP);

        return wordComponent.intValue() + timeComponent.intValue();
    }

    /**
     * Returns the Accuracy Multiplier according to D3/D5 specifications:
     * >= 98.0%: 1.50x
     * 95.0% - 97.9%: 1.20x
     * 90.0% - 94.9%: 1.00x
     * 80.0% - 89.9%: 0.75x
     * < 80.0%: 0.50x
     */
    public double getAccuracyMultiplier(double accuracyPercentage) {
        if (accuracyPercentage >= 98.0) {
            return 1.50;
        } else if (accuracyPercentage >= 95.0) {
            return 1.20;
        } else if (accuracyPercentage >= 90.0) {
            return 1.00;
        } else if (accuracyPercentage >= 80.0) {
            return 0.75;
        } else {
            return 0.50;
        }
    }

    /**
     * Calculates adjusted base XP by applying the accuracy multiplier with half-up rounding:
     * XP_adjusted = round(XP_base * Multiplier_accuracy).
     */
    public int calculateAdjustedBaseXp(int baseXp, double accuracyPercentage) {
        double multiplier = getAccuracyMultiplier(accuracyPercentage);
        return BigDecimal.valueOf(baseXp)
                .multiply(BigDecimal.valueOf(multiplier))
                .setScale(0, RoundingMode.HALF_UP)
                .intValue();
    }

    /**
     * Applies D5 daily diminishing returns scoped to lesson ID and calendar day:
     * Attempts 1-3 of the lesson ID: 100% of adjusted base XP.
     * Attempts 4-5 of the lesson ID: 50% of adjusted base XP (round half-up).
     * Attempts 6+ of the lesson ID: 0 XP.
     */
    public int applyDiminishingReturns(int adjustedBaseXp, int attemptNumberToday) {
        if (attemptNumberToday <= 3) {
            return adjustedBaseXp;
        } else if (attemptNumberToday <= 5) {
            return BigDecimal.valueOf(adjustedBaseXp)
                    .multiply(BigDecimal.valueOf(0.5))
                    .setScale(0, RoundingMode.HALF_UP)
                    .intValue();
        } else {
            return 0;
        }
    }

    /**
     * Calculates level threshold using the quadratic curve documented in D1:
     * XP_req(L) = round(120 * L^1.35) for level L.
     */
    public int calculateLevelFromXp(int totalXp) {
        if (totalXp <= 0) return 1;
        int level = 1;
        int cumulativeXp = 0;
        while (level < 100) {
            int nextLevelThreshold = getXpRequiredForNextLevel(level);
            if (cumulativeXp + nextLevelThreshold > totalXp) {
                break;
            }
            cumulativeXp += nextLevelThreshold;
            level++;
        }
        return level;
    }

    public int getXpRequiredForNextLevel(int currentLevel) {
        return BigDecimal.valueOf(120.0 * Math.pow(currentLevel, 1.35))
                .setScale(0, RoundingMode.HALF_UP)
                .intValue();
    }

    public int getXpProgressInCurrentLevel(int totalXp, int currentLevel) {
        int cumulativeXpBefore = 0;
        for (int l = 1; l < currentLevel; l++) {
            cumulativeXpBefore += getXpRequiredForNextLevel(l);
        }
        return Math.max(0, totalXp - cumulativeXpBefore);
    }

    public String getTierForLevel(int level) {
        if (level >= 81) return "Grandmaster";
        if (level >= 61) return "Keystroke Pro";
        if (level >= 41) return "Touch Typist";
        if (level >= 21) return "Journeyman";
        if (level >= 11) return "Apprentice";
        return "Novice";
    }

    /**
     * Adds XP idempotently using user_reward_ledger.
     * Returns true if newly awarded, false if duplicate.
     */
    public boolean awardReward(UUID userId, String rewardEventId, String sessionId, String rewardType, int xpAmount) {
        if (userRewardLedgerRepository.findByRewardEventId(rewardEventId).isPresent()) {
            return false;
        }

        UserRewardLedgerEntity ledgerEntry = new UserRewardLedgerEntity(
                rewardEventId,
                sessionId,
                rewardType,
                xpAmount,
                Instant.now()
        );
        userRewardLedgerRepository.save(ledgerEntry);

        UserGamificationEntity gamification = getOrCreateGamification(userId);
        int newTotalXp = gamification.getTotalXp() + xpAmount;
        gamification.setTotalXp(newTotalXp);

        int newLevel = calculateLevelFromXp(newTotalXp);
        gamification.setCurrentLevel(newLevel);
        gamification.setCurrentTier(getTierForLevel(newLevel));
        gamification.setUpdatedAt(Instant.now());
        userGamificationRepository.save(gamification);

        return true;
    }

    public boolean checkAndAwardDailyGoalBonus(UUID userId, LocalDate localDate, double totalPracticeSecondsToday, int goalMinutes) {
        double goalSeconds = goalMinutes * 60.0;
        if (totalPracticeSecondsToday < goalSeconds) {
            return false;
        }

        String eventId = "DAILY_GOAL_" + userId + "_" + localDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
        return awardReward(userId, eventId, null, "DAILY_GOAL_COMPLETION", DAILY_GOAL_BONUS_XP);
    }

    public boolean hasDailyGoalBonusBeenAwarded(UUID userId, LocalDate localDate) {
        String eventId = "DAILY_GOAL_" + userId + "_" + localDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
        return userRewardLedgerRepository.findByRewardEventId(eventId).isPresent();
    }

    public void evaluateDailyStreak(UUID userId, LocalDate today, boolean goalMetToday) {
        UserGamificationEntity gamification = getOrCreateGamification(userId);
        if (!goalMetToday) {
            return;
        }

        String lastDateStr = gamification.getLastPracticeDate();
        if (lastDateStr == null) {
            gamification.setCurrentStreakDays(1);
            gamification.setLongestStreakDays(Math.max(1, gamification.getLongestStreakDays()));
            gamification.setLastPracticeDate(today.toString());
        } else {
            LocalDate lastDate = LocalDate.parse(lastDateStr);
            if (lastDate.equals(today)) {
                return;
            } else if (lastDate.plusDays(1).equals(today)) {
                int newStreak = gamification.getCurrentStreakDays() + 1;
                gamification.setCurrentStreakDays(newStreak);
                gamification.setLongestStreakDays(Math.max(newStreak, gamification.getLongestStreakDays()));
                gamification.setLastPracticeDate(today.toString());

                if (newStreak % 7 == 0 && gamification.getFreezeShieldsAvailable() < MAX_FREEZE_SHIELDS) {
                    gamification.setFreezeShieldsAvailable(gamification.getFreezeShieldsAvailable() + 1);
                }
            } else if (lastDate.plusDays(2).equals(today) && gamification.getFreezeShieldsAvailable() > 0) {
                // Preserved streak: 1 shield deployed
                gamification.setFreezeShieldsAvailable(gamification.getFreezeShieldsAvailable() - 1);
                int newStreak = gamification.getCurrentStreakDays() + 1;
                gamification.setCurrentStreakDays(newStreak);
                gamification.setLongestStreakDays(Math.max(newStreak, gamification.getLongestStreakDays()));
                gamification.setLastPracticeDate(today.toString());
            } else {
                gamification.setCurrentStreakDays(1);
                gamification.setLastPracticeDate(today.toString());
            }
        }
        gamification.setUpdatedAt(Instant.now());
        userGamificationRepository.save(gamification);
    }
}
