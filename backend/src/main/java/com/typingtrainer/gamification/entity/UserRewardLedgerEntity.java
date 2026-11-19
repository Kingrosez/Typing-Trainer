package com.typingtrainer.gamification.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Table(name = "user_reward_ledger")
public class UserRewardLedgerEntity {

    @Id
    @Column(name = "reward_event_id", nullable = false, unique = true, columnDefinition = "TEXT")
    private String rewardEventId;

    @Column(name = "session_id", columnDefinition = "TEXT")
    private String sessionId;

    @Column(name = "reward_type", nullable = false)
    private String rewardType;

    @Column(name = "xp_amount", nullable = false)
    private int xpAmount;

    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "awarded_at", nullable = false, columnDefinition = "TEXT")
    private Instant awardedAt;

    protected UserRewardLedgerEntity() {
        // JPA
    }

    public UserRewardLedgerEntity(String rewardEventId, String sessionId, String rewardType,
                                  int xpAmount, Instant awardedAt) {
        this.rewardEventId = rewardEventId;
        this.sessionId = sessionId;
        this.rewardType = rewardType;
        this.xpAmount = xpAmount;
        this.awardedAt = awardedAt;
    }

    public String getRewardEventId() { return rewardEventId; }
    public String getSessionId() { return sessionId; }
    public String getRewardType() { return rewardType; }
    public int getXpAmount() { return xpAmount; }
    public Instant getAwardedAt() { return awardedAt; }
}
