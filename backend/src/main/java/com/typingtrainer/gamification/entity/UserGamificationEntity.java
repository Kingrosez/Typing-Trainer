package com.typingtrainer.gamification.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_gamification")
public class UserGamificationEntity {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "user_id", nullable = false, unique = true, columnDefinition = "TEXT")
    private UUID userId;

    @Column(name = "total_xp", nullable = false)
    private int totalXp = 0;

    @Column(name = "current_level", nullable = false)
    private int currentLevel = 1;

    @Column(name = "current_tier", nullable = false)
    private String currentTier = "Novice";

    @Column(name = "current_streak_days", nullable = false)
    private int currentStreakDays = 0;

    @Column(name = "longest_streak_days", nullable = false)
    private int longestStreakDays = 0;

    @Column(name = "freeze_shields_available", nullable = false)
    private int freezeShieldsAvailable = 0;

    @Column(name = "last_practice_date")
    private String lastPracticeDate;

    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "updated_at", nullable = false, columnDefinition = "TEXT")
    private Instant updatedAt;

    protected UserGamificationEntity() {
        // JPA
    }

    public UserGamificationEntity(UUID userId, int totalXp, int currentLevel, String currentTier,
                                  int currentStreakDays, int longestStreakDays, int freezeShieldsAvailable,
                                  String lastPracticeDate, Instant updatedAt) {
        this.userId = userId;
        this.totalXp = totalXp;
        this.currentLevel = currentLevel;
        this.currentTier = currentTier;
        this.currentStreakDays = currentStreakDays;
        this.longestStreakDays = longestStreakDays;
        this.freezeShieldsAvailable = freezeShieldsAvailable;
        this.lastPracticeDate = lastPracticeDate;
        this.updatedAt = updatedAt;
    }

    public UUID getUserId() { return userId; }
    public int getTotalXp() { return totalXp; }
    public void setTotalXp(int totalXp) { this.totalXp = totalXp; }
    public int getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(int currentLevel) { this.currentLevel = currentLevel; }
    public String getCurrentTier() { return currentTier; }
    public void setCurrentTier(String currentTier) { this.currentTier = currentTier; }
    public int getCurrentStreakDays() { return currentStreakDays; }
    public void setCurrentStreakDays(int currentStreakDays) { this.currentStreakDays = currentStreakDays; }
    public int getLongestStreakDays() { return longestStreakDays; }
    public void setLongestStreakDays(int longestStreakDays) { this.longestStreakDays = longestStreakDays; }
    public int getFreezeShieldsAvailable() { return freezeShieldsAvailable; }
    public void setFreezeShieldsAvailable(int freezeShieldsAvailable) { this.freezeShieldsAvailable = freezeShieldsAvailable; }
    public String getLastPracticeDate() { return lastPracticeDate; }
    public void setLastPracticeDate(String lastPracticeDate) { this.lastPracticeDate = lastPracticeDate; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
