package com.typingtrainer.recommendation.service;

import com.typingtrainer.dashboard.dto.DashboardSummaryResponse.WeakKeyOverviewDto;
import com.typingtrainer.recommendation.dto.WeakKeyRecommendation;
import com.typingtrainer.telemetry.entity.KeyTelemetryEntity;
import com.typingtrainer.telemetry.repository.KeyTelemetryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private KeyTelemetryRepository keyTelemetryRepository;

    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        recommendationService = new RecommendationService(keyTelemetryRepository);
    }

    @Test
    @DisplayName("classifyKey: Insufficient Data when opportunities < 20 (cannot be Mastered)")
    void testClassifyKeyInsufficientData() {
        // 19 opportunities with 0 errors is still Insufficient Data, NEVER Mastered
        assertThat(recommendationService.classifyKey(19, 0, true)).isEqualTo("Insufficient Data");
        assertThat(recommendationService.classifyKey(19, 5, false)).isEqualTo("Insufficient Data");
        assertThat(recommendationService.classifyKey(0, 0, false)).isEqualTo("Insufficient Data");
    }

    @Test
    @DisplayName("classifyKey: Error rate <= 3.0% requires 3 qualifying clean sessions for Mastered; otherwise Stable")
    void testClassifyKeyMasteredRequiresThreeCleanSessions() {
        // <= 3.0% without 3 clean sessions -> Stable
        assertThat(recommendationService.classifyKey(100, 2, false)).isEqualTo("Stable");
        assertThat(recommendationService.classifyKey(100, 3, false)).isEqualTo("Stable");

        // <= 3.0% WITH 3 clean sessions -> Mastered
        assertThat(recommendationService.classifyKey(100, 2, true)).isEqualTo("Mastered");
        assertThat(recommendationService.classifyKey(100, 3, true)).isEqualTo("Mastered");
    }

    @Test
    @DisplayName("classifyKey: Stable (3-5%), Developing (5-8%), and Weak (>8%)")
    void testClassifyKeyOtherTiers() {
        // Stable: > 3.0% and <= 5.0%
        assertThat(recommendationService.classifyKey(100, 4, false)).isEqualTo("Stable");
        assertThat(recommendationService.classifyKey(100, 5, false)).isEqualTo("Stable");

        // Developing: > 5.0% and <= 8.0%
        assertThat(recommendationService.classifyKey(100, 6, false)).isEqualTo("Developing");
        assertThat(recommendationService.classifyKey(100, 8, false)).isEqualTo("Developing");

        // Weak: > 8.0%
        assertThat(recommendationService.classifyKey(100, 9, false)).isEqualTo("Weak");
        assertThat(recommendationService.classifyKey(100, 15, false)).isEqualTo("Weak");
    }

    @Test
    @DisplayName("analyzeRecommendations: Enforces 3 distinct completed qualifying sessions for mastery")
    void testThreeCleanSessionsQualification() {
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("e"));

        // Key 'e': 3 distinct sessions with >= 30 opps and <= 3.0% error
        KeyTelemetryEntity e1 = new KeyTelemetryEntity(UUID.randomUUID(), "s1", "e", 35, 1, 150, Instant.now()); // 2.8%
        KeyTelemetryEntity e2 = new KeyTelemetryEntity(UUID.randomUUID(), "s2", "e", 40, 0, 140, Instant.now()); // 0.0%
        KeyTelemetryEntity e3 = new KeyTelemetryEntity(UUID.randomUUID(), "s3", "e", 32, 0, 130, Instant.now()); // 0.0%
        when(keyTelemetryRepository.findRecentForKeySince(eq("e"), any(Instant.class)))
                .thenReturn(List.of(e1, e2, e3));

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();

        assertThat(analysis.overview().overallStatus()).isEqualTo("MASTERED");
        assertThat(analysis.overview().masteredKeyCount()).isEqualTo(1);
        assertThat(analysis.overview().weakKeyCount()).isEqualTo(0);
        assertThat(analysis.recommendations()).isEmpty();
    }

    @Test
    @DisplayName("analyzeRecommendations: Single good session does NOT establish mastery (returns STABLE)")
    void testSingleGoodSessionDoesNotEstablishMastery() {
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("e"));

        // Only 1 qualifying clean session
        KeyTelemetryEntity e1 = new KeyTelemetryEntity(UUID.randomUUID(), "s1", "e", 50, 1, 150, Instant.now()); // 2.0%
        when(keyTelemetryRepository.findRecentForKeySince(eq("e"), any(Instant.class)))
                .thenReturn(List.of(e1));

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();

        assertThat(analysis.overview().overallStatus()).isEqualTo("STABLE");
        assertThat(analysis.overview().masteredKeyCount()).isEqualTo(0);
        assertThat(analysis.overview().stableKeyCount()).isEqualTo(1);
    }

    @Test
    @DisplayName("analyzeRecommendations: Streak resets when a qualifying session has > 3% error")
    void testStreakResetsOnErrorSpike() {
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("e"));

        // Reverse chronological order:
        // Recent 1: 35 opps, 2 errors (5.7% > 3%) -> Breaks streak!
        // Older 2: 35 opps, 0 errors
        // Older 3: 35 opps, 0 errors
        KeyTelemetryEntity e1 = new KeyTelemetryEntity(UUID.randomUUID(), "s1", "e", 35, 2, 150, Instant.now());
        KeyTelemetryEntity e2 = new KeyTelemetryEntity(UUID.randomUUID(), "s2", "e", 35, 0, 140, Instant.now().minusSeconds(100));
        KeyTelemetryEntity e3 = new KeyTelemetryEntity(UUID.randomUUID(), "s3", "e", 35, 0, 130, Instant.now().minusSeconds(200));
        when(keyTelemetryRepository.findRecentForKeySince(eq("e"), any(Instant.class)))
                .thenReturn(List.of(e1, e2, e3));

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();

        // Total: 105 opps capped to 100 opps. e1 had 2 errors on 35 opps (5.7%)
        assertThat(analysis.overview().overallStatus()).isNotEqualTo("MASTERED");
        assertThat(analysis.overview().masteredKeyCount()).isEqualTo(0);
    }

    @Test
    @DisplayName("analyzeRecommendations: Sessions with < 30 opps are neutral (do not break or advance streak)")
    void testNeutralSessionsUnder30Opportunities() {
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("e"));

        // Reverse chronological order:
        // Clean session 1: 35 opps, 0 errors
        // Neutral session: 15 opps, 0 errors (neutral)
        // Clean session 2: 35 opps, 0 errors
        // Clean session 3: 35 opps, 0 errors
        KeyTelemetryEntity e1 = new KeyTelemetryEntity(UUID.randomUUID(), "s1", "e", 35, 0, 150, Instant.now());
        KeyTelemetryEntity e2 = new KeyTelemetryEntity(UUID.randomUUID(), "s2", "e", 15, 0, 150, Instant.now().minusSeconds(50));
        KeyTelemetryEntity e3 = new KeyTelemetryEntity(UUID.randomUUID(), "s3", "e", 35, 0, 140, Instant.now().minusSeconds(100));
        KeyTelemetryEntity e4 = new KeyTelemetryEntity(UUID.randomUUID(), "s4", "e", 35, 0, 130, Instant.now().minusSeconds(200));
        when(keyTelemetryRepository.findRecentForKeySince(eq("e"), any(Instant.class)))
                .thenReturn(List.of(e1, e2, e3, e4));

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();

        // Neutral session did not break the 3 clean sessions!
        assertThat(analysis.overview().overallStatus()).isEqualTo("MASTERED");
        assertThat(analysis.overview().masteredKeyCount()).isEqualTo(1);
    }

    @Test
    @DisplayName("analyzeRecommendations: Distinct states for INSUFFICIENT_DATA and WEAK")
    void testDistinctOverviewStates() {
        // 1. INSUFFICIENT_DATA when all keys have < 20 opps
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("z"));
        KeyTelemetryEntity z1 = new KeyTelemetryEntity(UUID.randomUUID(), "s1", "z", 10, 2, 200, Instant.now());
        when(keyTelemetryRepository.findRecentForKeySince(eq("z"), any(Instant.class)))
                .thenReturn(List.of(z1));

        WeakKeyOverviewDto overview = recommendationService.analyzeRecommendations().overview();
        assertThat(overview.overallStatus()).isEqualTo("INSUFFICIENT_DATA");

        // 2. WEAK when any key > 8% with >= 20 opps
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("r"));
        KeyTelemetryEntity r1 = new KeyTelemetryEntity(UUID.randomUUID(), "s2", "r", 25, 3, 200, Instant.now()); // 12%
        when(keyTelemetryRepository.findRecentForKeySince(eq("r"), any(Instant.class)))
                .thenReturn(List.of(r1));

        RecommendationService.RecommendationAnalysis analysis = recommendationService.analyzeRecommendations();
        assertThat(analysis.overview().overallStatus()).isEqualTo("WEAK");
        assertThat(analysis.overview().weakKeyCount()).isEqualTo(1);
        assertThat(analysis.recommendations()).hasSize(1);
        assertThat(analysis.recommendations().get(0).keyChar()).isEqualTo("r");
    }
}
