package com.typingtrainer.typing.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "typing_sessions")
public class TypingSessionEntity {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", nullable = false, unique = true, columnDefinition = "TEXT")
    private UUID id;

    @Column(name = "gross_wpm", nullable = false)
    private double grossWpm;

    @Column(name = "net_wpm", nullable = false)
    private double netWpm;

    @Column(name = "accuracy", nullable = false)
    private double accuracy;

    @Column(name = "total_errors", nullable = false)
    private int totalErrors;

    @Column(name = "raw_characters", nullable = false)
    private int rawCharacters;

    @Column(name = "correct_characters", nullable = false)
    private int correctCharacters;

    @Column(name = "duration_seconds", nullable = false)
    private double durationSeconds;

    @Column(name = "passage", nullable = false, columnDefinition = "TEXT")
    private String passage;

    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "completed_at", nullable = false, columnDefinition = "TEXT")
    private Instant completedAt;

    @Column(name = "session_mode", nullable = false)
    private String sessionMode = "TYPING_TEST";

    @Column(name = "test_duration_target", nullable = false)
    private int testDurationTarget = 60;

    @Column(name = "is_official_benchmark", nullable = false)
    private boolean officialBenchmark = true;

    @Column(name = "xp_earned", nullable = false)
    private int xpEarned = 0;

    protected TypingSessionEntity() {
        // JPA
    }

    public TypingSessionEntity(UUID id, double grossWpm, double netWpm, double accuracy,
                                int totalErrors, int rawCharacters, int correctCharacters,
                                double durationSeconds, String passage, Instant completedAt) {
        this(id, grossWpm, netWpm, accuracy, totalErrors, rawCharacters, correctCharacters,
                durationSeconds, passage, completedAt, "TYPING_TEST", 60, true, 0);
    }

    public TypingSessionEntity(UUID id, double grossWpm, double netWpm, double accuracy,
                                int totalErrors, int rawCharacters, int correctCharacters,
                                double durationSeconds, String passage, Instant completedAt,
                                String sessionMode, int testDurationTarget, boolean officialBenchmark,
                                int xpEarned) {
        this.id = id;
        this.grossWpm = grossWpm;
        this.netWpm = netWpm;
        this.accuracy = accuracy;
        this.totalErrors = totalErrors;
        this.rawCharacters = rawCharacters;
        this.correctCharacters = correctCharacters;
        this.durationSeconds = durationSeconds;
        this.passage = passage;
        this.completedAt = completedAt;
        this.sessionMode = sessionMode != null ? sessionMode : "TYPING_TEST";
        this.testDurationTarget = testDurationTarget > 0 ? testDurationTarget : 60;
        this.officialBenchmark = officialBenchmark;
        this.xpEarned = xpEarned;
    }

    public UUID getId() { return id; }
    public double getGrossWpm() { return grossWpm; }
    public double getNetWpm() { return netWpm; }
    public double getAccuracy() { return accuracy; }
    public int getTotalErrors() { return totalErrors; }
    public int getRawCharacters() { return rawCharacters; }
    public int getCorrectCharacters() { return correctCharacters; }
    public double getDurationSeconds() { return durationSeconds; }
    public String getPassage() { return passage; }
    public Instant getCompletedAt() { return completedAt; }
    public String getSessionMode() { return sessionMode; }
    public int getTestDurationTarget() { return testDurationTarget; }
    public boolean isOfficialBenchmark() { return officialBenchmark; }
    public int getXpEarned() { return xpEarned; }
}
