package com.typingtrainer.recommendation.service;

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
    @DisplayName("classifyKey satisfies all five D6 threshold tiers")
    void testClassifyKeyTiers() {
        // Insufficient Data: < 20
        assertThat(recommendationService.classifyKey(19, 5)).isEqualTo("Insufficient Data");

        // Mastered: <= 3.0% (e.g. 2 errors on 100 strokes = 2.0%)
        assertThat(recommendationService.classifyKey(100, 2)).isEqualTo("Mastered");

        // Stable: > 3.0% and <= 5.0% (e.g. 4 errors on 100 strokes = 4.0%)
        assertThat(recommendationService.classifyKey(100, 4)).isEqualTo("Stable");

        // Developing: > 5.0% and <= 8.0% (e.g. 7 errors on 100 strokes = 7.0%)
        assertThat(recommendationService.classifyKey(100, 7)).isEqualTo("Developing");

        // Weak: > 8.0% (e.g. 10 errors on 100 strokes = 10.0%)
        assertThat(recommendationService.classifyKey(100, 10)).isEqualTo("Weak");
    }

    @Test
    @DisplayName("getRecommendations evaluates most recent 100 eligible opportunities and ranks by WPI")
    void testWpiRankingWith100OpportunityWindow() {
        // Mock distinct keys: "p", "b", "e"
        when(keyTelemetryRepository.findObservedKeysSince(any(Instant.class)))
                .thenReturn(List.of("p", "b", "e"));

        // Key 'p': two recent sessions totaling 80 opps, 8 errors (10.0% errRate) -> WPI = 10.0 * ln(81) = 43.9
        KeyTelemetryEntity p1 = new KeyTelemetryEntity(UUID.randomUUID(), "s1", "p", 50, 5, 200, Instant.now());
        KeyTelemetryEntity p2 = new KeyTelemetryEntity(UUID.randomUUID(), "s2", "p", 30, 3, 200, Instant.now());
        when(keyTelemetryRepository.findRecentForKeySince(eq("p"), any(Instant.class)))
                .thenReturn(List.of(p1, p2));

        // Key 'b': one session of 20 opps, 2 errors (10.0% errRate) -> WPI = 10.0 * ln(21) = 30.4
        KeyTelemetryEntity b1 = new KeyTelemetryEntity(UUID.randomUUID(), "s3", "b", 20, 2, 250, Instant.now());
        when(keyTelemetryRepository.findRecentForKeySince(eq("b"), any(Instant.class)))
                .thenReturn(List.of(b1));

        // Key 'e': one session with 120 opps, capped to 100 opps, 2 errors -> 2.0% errRate -> Mastered
        KeyTelemetryEntity e1 = new KeyTelemetryEntity(UUID.randomUUID(), "s4", "e", 120, 2, 150, Instant.now());
        when(keyTelemetryRepository.findRecentForKeySince(eq("e"), any(Instant.class)))
                .thenReturn(List.of(e1));

        List<WeakKeyRecommendation> recommendations = recommendationService.getRecommendations();

        // Only P and B should be in Weak recommendations; P has higher WPI than B
        assertThat(recommendations).hasSize(2);
        assertThat(recommendations.get(0).keyChar()).isEqualTo("p");
        assertThat(recommendations.get(0).opportunities()).isEqualTo(80);
        assertThat(recommendations.get(0).wpi()).isGreaterThan(recommendations.get(1).wpi());
        assertThat(recommendations.get(1).keyChar()).isEqualTo("b");
    }
}
