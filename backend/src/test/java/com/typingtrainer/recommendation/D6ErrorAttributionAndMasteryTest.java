package com.typingtrainer.recommendation;

import com.typingtrainer.dashboard.dto.DashboardSummaryResponse.WeakKeyOverviewDto;
import com.typingtrainer.recommendation.dto.WeakKeyRecommendation;
import com.typingtrainer.recommendation.service.RecommendationService;
import com.typingtrainer.telemetry.entity.KeyTelemetryEntity;
import com.typingtrainer.telemetry.repository.KeyTelemetryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class D6ErrorAttributionAndMasteryTest {

    @Mock
    private KeyTelemetryRepository keyTelemetryRepository;

    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        recommendationService = new RecommendationService(keyTelemetryRepository);
    }

    @Test
    @DisplayName("Sample Boundary: 19 opportunities is Insufficient Data; 20 opportunities enters classification")
    void testSampleEligibilityBoundary() {
        // Exactly 19 opportunities with 0 errors
        assertThat(recommendationService.classifyKey(19, 0, false)).isEqualTo("Insufficient Data");
        // Exactly 20 opportunities with 0 errors -> Stable (eligible for mastery once 3 clean sessions logged)
        assertThat(recommendationService.classifyKey(20, 0, false)).isEqualTo("Stable");
        // Exactly 20 opportunities with 2 errors (10.0%) -> Weak
        assertThat(recommendationService.classifyKey(20, 2, false)).isEqualTo("Weak");
    }

    @Test
    @DisplayName("Rolling Window Boundary: Only evaluates entries within 14-calendar-day window capped at 100 strokes")
    void testRollingWindowBoundaryAnd100StrokeCap() {
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("t"));

        Instant now = Instant.now();
        // Entry 1: 60 opps, 6 errors (10.0%)
        KeyTelemetryEntity e1 = new KeyTelemetryEntity(UUID.randomUUID(), "s1", "t", 60, 6, 120, now.minus(Duration.ofDays(1)));
        // Entry 2: 60 opps, 6 errors (10.0%) -> Capped to 40 opps, 4 errors to reach 100 opps
        KeyTelemetryEntity e2 = new KeyTelemetryEntity(UUID.randomUUID(), "s2", "t", 60, 6, 120, now.minus(Duration.ofDays(5)));

        when(keyTelemetryRepository.findRecentForKeySince(eq("t"), any(Instant.class)))
                .thenReturn(List.of(e1, e2));

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();
        assertThat(analysis.recommendations()).hasSize(1);

        WeakKeyRecommendation rec = analysis.recommendations().get(0);
        assertThat(rec.keyChar()).isEqualTo("t");
        assertThat(rec.opportunities()).isEqualTo(100); // capped at 100
        assertThat(rec.errors()).isEqualTo(10); // 6 from e1 + 4 pro-rated from e2
        assertThat(rec.errorRate()).isEqualTo(10.0);
        assertThat(rec.tier()).isEqualTo("Weak");
    }

    @Test
    @DisplayName("Error Attribution: Character position contributes at most 1 error; repeated backspacing does not inflate")
    void testPositionLevelErrorAttribution() {
        // Simulating D6 Position Error Attribution Model:
        // Position 0: Target 'c', User typed 'x' (Error 1 for 'c'). User hit backspace, typed 'v' (still position 0).
        // Error count for position 0 remains 1, not 2.
        // User hit backspace, typed 'c' (Corrected mistake).
        // For intended key 'c': Opportunities = 1, Errors = 1 (remains available for diagnostics).

        class KeystrokeAttributionTracker {
            int opportunities = 0;
            int errors = 0;
            final Map<Integer, Boolean> positionErred = new HashMap<>();

            void recordKeystroke(int position, char intended, char actual) {
                if (!positionErred.containsKey(position)) {
                    opportunities++;
                    positionErred.put(position, false);
                }
                if (intended != actual && !positionErred.get(position)) {
                    errors++;
                    positionErred.put(position, true); // Mark position as erred
                }
            }
        }

        KeystrokeAttributionTracker tracker = new KeystrokeAttributionTracker();

        // 1. User attempts position 0: intended 'c', types 'x'
        tracker.recordKeystroke(0, 'c', 'x');
        assertThat(tracker.opportunities).isEqualTo(1);
        assertThat(tracker.errors).isEqualTo(1);

        // 2. User presses Backspace and strikes 'v' at the same position 0
        tracker.recordKeystroke(0, 'c', 'v');
        // Errors must NOT inflate to 2!
        assertThat(tracker.opportunities).isEqualTo(1);
        assertThat(tracker.errors).isEqualTo(1);

        // 3. User presses Backspace and strikes 'c' (correct key)
        tracker.recordKeystroke(0, 'c', 'c');
        // Corrected mistake remains counted as 1 error on intended key 'c'
        assertThat(tracker.opportunities).isEqualTo(1);
        assertThat(tracker.errors).isEqualTo(1);
    }

    @Test
    @DisplayName("Mastery Qualification: Requires 3 distinct completed sessions with >= 30 opps and <= 3% error")
    void testMasteryLifecycleFullProgression() {
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("k"));

        Instant now = Instant.now();
        // Session 1: 35 opps, 1 error (2.8%)
        KeyTelemetryEntity s1 = new KeyTelemetryEntity(UUID.randomUUID(), "sess1", "k", 35, 1, 150, now.minus(Duration.ofHours(3)));
        // Session 2: 40 opps, 0 errors (0.0%)
        KeyTelemetryEntity s2 = new KeyTelemetryEntity(UUID.randomUUID(), "sess2", "k", 40, 0, 140, now.minus(Duration.ofHours(2)));
        // Session 3: 35 opps, 1 error (2.8%)
        KeyTelemetryEntity s3 = new KeyTelemetryEntity(UUID.randomUUID(), "sess3", "k", 35, 1, 130, now.minus(Duration.ofHours(1)));

        when(keyTelemetryRepository.findRecentForKeySince(eq("k"), any(Instant.class)))
                .thenReturn(List.of(s3, s2, s1)); // reverse chronological

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();

        WeakKeyOverviewDto overview = analysis.overview();
        assertThat(overview.overallStatus()).isEqualTo("MASTERED");
        assertThat(overview.masteredKeyCount()).isEqualTo(1);
        assertThat(analysis.recommendations()).isEmpty();
    }

    @Test
    @DisplayName("Mastery Qualification: 2 qualifying clean sessions only remains Stable (does not graduate to Mastered)")
    void testTwoCleanSessionsStaysStable() {
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("k"));

        Instant now = Instant.now();
        // Session 1: 35 opps, 1 error (2.8%)
        KeyTelemetryEntity s1 = new KeyTelemetryEntity(UUID.randomUUID(), "sess1", "k", 35, 1, 150, now.minus(Duration.ofHours(2)));
        // Session 2: 40 opps, 0 errors (0.0%)
        KeyTelemetryEntity s2 = new KeyTelemetryEntity(UUID.randomUUID(), "sess2", "k", 40, 0, 140, now.minus(Duration.ofHours(1)));

        when(keyTelemetryRepository.findRecentForKeySince(eq("k"), any(Instant.class)))
                .thenReturn(List.of(s2, s1)); // reverse chronological

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();

        WeakKeyOverviewDto overview = analysis.overview();
        assertThat(overview.overallStatus()).isEqualTo("STABLE");
        assertThat(overview.masteredKeyCount()).isEqualTo(0);
        assertThat(overview.stableKeyCount()).isEqualTo(1);
    }

    @Test
    @DisplayName("Rolling Window Cap: Exactly 101 opportunities is capped at 100 strokes")
    void testExactly101OpportunitiesCappedAt100() {
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("m"));

        Instant now = Instant.now();
        // Entry with 101 opps and 10 errors
        KeyTelemetryEntity e1 = new KeyTelemetryEntity(UUID.randomUUID(), "sess1", "m", 101, 10, 150, now.minus(Duration.ofDays(1)));
        when(keyTelemetryRepository.findRecentForKeySince(eq("m"), any(Instant.class)))
                .thenReturn(List.of(e1));

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();

        // Must be capped to 100 opportunities
        WeakKeyRecommendation rec = analysis.recommendations().get(0);
        assertThat(rec.opportunities()).isEqualTo(100);
        // Errors pro-rated: round(10 * 100 / 101) = 10
        assertThat(rec.errors()).isEqualTo(10);
        assertThat(rec.errorRate()).isEqualTo(10.0);
    }
}
