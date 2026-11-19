package com.typingtrainer.typing.repository;

import com.typingtrainer.typing.entity.TypingSessionEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface TypingSessionRepository extends JpaRepository<TypingSessionEntity, UUID> {

    @Query("SELECT s FROM TypingSessionEntity s ORDER BY s.completedAt DESC")
    List<TypingSessionEntity> findRecentSessions(Pageable pageable);

    @Query("SELECT s FROM TypingSessionEntity s WHERE s.completedAt >= :startDate ORDER BY s.completedAt ASC")
    List<TypingSessionEntity> findSessionsSince(@Param("startDate") Instant startDate);

    @Query("""
        SELECT s FROM TypingSessionEntity s
        WHERE s.testDurationTarget = :duration
          AND s.accuracy >= :minAccuracy
          AND s.officialBenchmark = true
        ORDER BY s.netWpm DESC
    """)
    List<TypingSessionEntity> findTopBenchmark(@Param("duration") int duration,
                                               @Param("minAccuracy") double minAccuracy,
                                               Pageable pageable);

    @Query("""
        SELECT s FROM TypingSessionEntity s
        WHERE s.sessionMode = :mode
          AND s.accuracy >= :minAccuracy
        ORDER BY s.netWpm DESC
    """)
    List<TypingSessionEntity> findTopByMode(@Param("mode") String mode,
                                            @Param("minAccuracy") double minAccuracy,
                                            Pageable pageable);

    @Query("SELECT s FROM TypingSessionEntity s ORDER BY s.durationSeconds DESC")
    List<TypingSessionEntity> findLongestSession(Pageable pageable);

    @Query("SELECT SUM(s.durationSeconds) FROM TypingSessionEntity s")
    Double sumTotalDurationSeconds();

    @Query("SELECT SUM(s.correctCharacters) FROM TypingSessionEntity s")
    Long sumCorrectCharacters();

    @Query("SELECT SUM(s.rawCharacters) FROM TypingSessionEntity s")
    Long sumRawCharacters();
}
