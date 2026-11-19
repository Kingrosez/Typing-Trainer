package com.typingtrainer.telemetry.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "key_telemetry")
public class KeyTelemetryEntity {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", nullable = false, unique = true, columnDefinition = "TEXT")
    private UUID id;

    @Column(name = "session_id", nullable = false, columnDefinition = "TEXT")
    private String sessionId;

    @Column(name = "key_char", nullable = false)
    private String keyChar;

    @Column(name = "opportunities", nullable = false)
    private int opportunities;

    @Column(name = "errors", nullable = false)
    private int errors;

    @Column(name = "total_latency_ms", nullable = false)
    private int totalLatencyMs;

    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "recorded_at", nullable = false, columnDefinition = "TEXT")
    private Instant recordedAt;

    protected KeyTelemetryEntity() {
        // JPA
    }

    public KeyTelemetryEntity(UUID id, String sessionId, String keyChar, int opportunities,
                              int errors, int totalLatencyMs, Instant recordedAt) {
        this.id = id;
        this.sessionId = sessionId;
        this.keyChar = keyChar;
        this.opportunities = opportunities;
        this.errors = errors;
        this.totalLatencyMs = totalLatencyMs;
        this.recordedAt = recordedAt;
    }

    public UUID getId() { return id; }
    public String getSessionId() { return sessionId; }
    public String getKeyChar() { return keyChar; }
    public int getOpportunities() { return opportunities; }
    public int getErrors() { return errors; }
    public int getTotalLatencyMs() { return totalLatencyMs; }
    public Instant getRecordedAt() { return recordedAt; }
}
