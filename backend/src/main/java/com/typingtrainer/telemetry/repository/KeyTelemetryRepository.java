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

    @Query("SELECT DISTINCT t.keyChar FROM KeyTelemetryEntity t WHERE t.recordedAt >= :cutoffDate")
    List<String> findObservedKeysSince(@Param("cutoffDate") Instant cutoffDate);

    @Query("""
        SELECT t FROM KeyTelemetryEntity t
        WHERE t.keyChar = :keyChar AND t.recordedAt >= :cutoffDate
        ORDER BY t.recordedAt DESC
    """)
    List<KeyTelemetryEntity> findRecentForKeySince(@Param("keyChar") String keyChar,
                                                   @Param("cutoffDate") Instant cutoffDate);
}
