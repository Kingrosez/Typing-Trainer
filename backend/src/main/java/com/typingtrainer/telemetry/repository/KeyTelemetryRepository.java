package com.typingtrainer.telemetry.repository;

import com.typingtrainer.telemetry.entity.KeyTelemetryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface KeyTelemetryRepository extends JpaRepository<KeyTelemetryEntity, UUID> {

    @Query("""
        SELECT t.keyChar AS keyChar, SUM(t.opportunities) AS totalOpportunities,
               SUM(t.errors) AS totalErrors, SUM(t.totalLatencyMs) AS totalLatencyMs
        FROM KeyTelemetryEntity t
        WHERE t.recordedAt >= :cutoffDate
        GROUP BY t.keyChar
    """)
    List<KeySummaryProjection> aggregateKeyTelemetrySince(@Param("cutoffDate") Instant cutoffDate);

    interface KeySummaryProjection {
        String getKeyChar();
        Long getTotalOpportunities();
        Long getTotalErrors();
        Long getTotalLatencyMs();
    }
}
