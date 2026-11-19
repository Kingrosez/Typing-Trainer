package com.typingtrainer.gamification.service;

import com.typingtrainer.gamification.entity.UserGamificationEntity;
import com.typingtrainer.gamification.entity.UserRewardLedgerEntity;
import com.typingtrainer.gamification.repository.UserGamificationRepository;
import com.typingtrainer.gamification.repository.UserRewardLedgerRepository;
import com.typingtrainer.profile.entity.UserProfileEntity;
import com.typingtrainer.profile.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
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
            // Ensure profile exists
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
     * Calculates deterministic Base Effort XP according to D3/D5:
     * XP_base = round(WordsTyped * 0.2) + round((ActiveSeconds / 60) * 5)
     * WordsTyped is correctCharacters / 5.
     */
    public int calculateBaseXp(int correctCharacters, double activeSeconds) {
        double wordsTyped = correctCharacters / 5.0;
        int wordComponent = (int) Math.round(wordsTyped * 0.2);
        int timeComponent = (int) Math.round((activeSeconds / 60.0) * 5.0);
        return wordComponent + timeComponent;
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
     * Applies accuracy multiplier and D5 daily diminishing returns.
     * Quality gate: if activeSeconds < 30 OR words < 20 -> 0 XP.
     * Diminishing returns:
     * Attempts 1-3: 100% of adjusted base XP.
     * Attempts 4-5: 50% of adjusted base XP.
     * Attempts 6+: 0 XP.
     */
    public int calculateSessionXp(int correctCharacters, double activeSeconds, double accuracyPercentage, int attemptNumberToday) {
        double wordsTyped = correctCharacters / 5.0;
        if (activeSeconds < 30.0 || wordsTyped < 20.0) {
            return 0; // Quality gate
        }

        int baseXp = calculateBaseXp(correctCharacters, activeSeconds);
        double multiplier = getAccuracyMultiplier(accuracyPercentage);
        int adjustedBase = (int) Math.round(baseXp * multiplier);

        if (attemptNumberToday <= 3) {
            return adjustedBase;
        } else if (attemptNumberToday <= 5) {
            return (int) Math.round(adjustedBase * 0.5);
        } else {
            return 0;
        }
    }

    /**
     * Evaluates level threshold using the approved quadratic curve:
     * XP_req(L) = round(120 * L^1.35) for level L.
     * Calculates cumulative XP and returns corresponding level.
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
        return (int) Math.round(120.0 * Math.pow(currentLevel, 1.35));
    }

    public int getXpProgressInCurrentLevel(int totalXp, int currentLevel) {
        int cumulativeXpBefore = 0;
        for (int l = 1; l < currentLevel; l++) {
            cumulativeXpBefore += getXpRequiredForNextLevel(l);
        }
        return Math.max(0, totalXp - cumulativeXpBefore);
    }

    /**
     * Maps level to D1/D3 Mastery Tier.
     */
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
     * Returns true if newly awarded, false if already awarded.
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

    /**
     * Evaluates daily goal completion and awards +150 XP bonus if newly met today.
     */
    public boolean checkAndAwardDailyGoalBonus(UUID userId, LocalDate localDate, double totalPracticeSecondsToday, int goalMinutes) {
        double goalSeconds = goalMinutes * 60.0;
        if (totalPracticeSecondsToday < goalSeconds) {
            return false;
        }

        String eventId = "DAILY_GOAL_" + userId + "_" + localDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
        return awardReward(userId, eventId, null, "DAILY_GOAL_COMPLETION", DAILY_GOAL_BONUS_XP);
    }

    /**
     * Updates streak based on daily goal completion and calendar continuity.
     * One freeze shield earned per 7 days of consecutive practice (max 2).
     * If user misses 1 day and has a freeze shield, shield is consumed and streak is preserved.
     */
    public void evaluateDailyStreak(UUID userId, LocalDate today, boolean goalMetToday) {
        UserGamificationEntity gamification = getOrCreateGamification(userId);
        if (!goalMetToday) {
            return;
        }

        String lastDateStr = gamification.getLastPracticeDate();
        if (lastDateStr == null) {
            // First ever practice day
            gamification.setCurrentStreakDays(1);
            gamification.setLongestStreakDays(Math.max(1, gamification.getLongestStreakDays()));
            gamification.setLastPracticeDate(today.toString());
        } else {
            LocalDate lastDate = LocalDate.parse(lastDateStr);
            if (lastDate.equals(today)) {
                // Already updated today
                return;
            } else if (lastDate.plusDays(1).equals(today)) {
                // Consecutive day
                int newStreak = gamification.getCurrentStreakDays() + 1;
                gamification.setCurrentStreakDays(newStreak);
                gamification.setLongestStreakDays(Math.max(newStreak, gamification.getLongestStreakDays()));
                gamification.setLastPracticeDate(today.toString());

                // Check 7-day shield award: 1 shield per 7 days of streak (up to max 2)
                if (newStreak % 7 == 0 && gamification.getFreezeShieldsAvailable() < MAX_FREEZE_SHIELDS) {
                    gamification.setFreezeShieldsAvailable(gamification.getFreezeShieldsAvailable() + 1);
                }
            } else if (lastDate.plusDays(2).equals(today) && gamification.getFreezeShieldsAvailable() > 0) {
                // Missed exactly 1 day, consume 1 shield to protect streak
                gamification.setFreezeShieldsAvailable(gamification.getFreezeShieldsAvailable() - 1);
                int newStreak = gamification.getCurrentStreakDays() + 1;
                gamification.setCurrentStreakDays(newStreak);
                gamification.setLongestStreakDays(Math.max(newStreak, gamification.getLongestStreakDays()));
                gamification.setLastPracticeDate(today.toString());
            } else {
                // Streak broken
                gamification.setCurrentStreakDays(1);
                gamification.setLastPracticeDate(today.toString());
            }
        }
        gamification.setUpdatedAt(Instant.now());
        userGamificationRepository.save(gamification);
    }
}
