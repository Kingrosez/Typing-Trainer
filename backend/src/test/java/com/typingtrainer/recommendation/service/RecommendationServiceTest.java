package com.typingtrainer.recommendation.service;

import com.typingtrainer.recommendation.dto.WeakKeyRecommendation;
import com.typingtrainer.telemetry.repository.KeyTelemetryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
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
    @DisplayName("getRecommendations ranks weak keys by WPI = ErrorRate * ln(Opportunities + 1)")
    void testWpiRanking() {
        // Mock 3 keys:
        // Key 'P': 80 opps, 8 errors (10.0% errRate) -> WPI = 10.0 * ln(81) = 43.94
        // Key 'B': 20 opps, 2 errors (10.0% errRate) -> WPI = 10.0 * ln(21) = 30.45
        // Key 'E': 100 opps, 2 errors (2.0% errRate) -> Mastered (not weak)

        KeyTelemetryRepository.KeySummaryProjection pProj = createProj("p", 80L, 8L);
        KeyTelemetryRepository.KeySummaryProjection bProj = createProj("b", 20L, 2L);
        KeyTelemetryRepository.KeySummaryProjection eProj = createProj("e", 100L, 2L);

        when(keyTelemetryRepository.aggregateKeyTelemetrySince(any(Instant.class)))
                .thenReturn(List.of(bProj, pProj, eProj));

        List<WeakKeyRecommendation> recommendations = recommendationService.getRecommendations();

        // Only P and B should be recommended, with P ranked ahead of B due to higher WPI
        assertThat(recommendations).hasSize(2);
        assertThat(recommendations.get(0).keyChar()).isEqualTo("p");
        assertThat(recommendations.get(0).wpi()).isGreaterThan(recommendations.get(1).wpi());
        assertThat(recommendations.get(1).keyChar()).isEqualTo("b");
    }

    private KeyTelemetryRepository.KeySummaryProjection createProj(String key, Long opps, Long errs) {
        return new KeyTelemetryRepository.KeySummaryProjection() {
            @Override public String getKeyChar() { return key; }
            @Override public Long getTotalOpportunities() { return opps; }
            @Override public Long getTotalErrors() { return errs; }
            @Override public Long getTotalLatencyMs() { return 500L; }
        };
    }
}
