package com.typingtrainer.typing.service;

import com.typingtrainer.common.response.PagedResponse;
import com.typingtrainer.gamification.service.GamificationService;
import com.typingtrainer.typing.dto.TypingSessionResponse;
import com.typingtrainer.typing.dto.TypingSessionSubmissionRequest;
import com.typingtrainer.typing.entity.TypingSessionEntity;
import com.typingtrainer.typing.repository.TypingSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TypingSessionServiceTest {

    @Mock
    private TypingSessionRepository repository;

    @Mock
    private GamificationService gamificationService;

    private TypingSessionService service;

    @BeforeEach
    void setUp() {
        service = new TypingSessionService(repository, gamificationService);
    }

    @Test
    void getRecentSessions_returnsPagedResponse() {
        UUID id = UUID.randomUUID();
        TypingSessionEntity entity = new TypingSessionEntity(
                id, 70.0, 65.0, 96.0, 2, 350, 336, 60.0, "sample text", Instant.now()
        );
        Page<TypingSessionEntity> page = new PageImpl<>(List.of(entity));

        when(repository.findAll(any(Pageable.class))).thenReturn(page);

        PagedResponse<TypingSessionResponse> result = service.getRecentSessions(0, 10, "completedAt,desc");

        assertThat(result.items()).hasSize(1);
        assertThat(result.items().get(0).id()).isEqualTo(id.toString());
        assertThat(result.totalItems()).isEqualTo(1);
    }

    @Test
    void getSession_returnsSessionWhenExists() {
        UUID id = UUID.randomUUID();
        TypingSessionEntity entity = new TypingSessionEntity(
                id, 70.0, 65.0, 96.0, 2, 350, 336, 60.0, "sample text", Instant.now()
        );

        when(repository.findById(id)).thenReturn(Optional.of(entity));

        Optional<TypingSessionResponse> result = service.getSession(id.toString());

        assertThat(result).isPresent();
        assertThat(result.get().id()).isEqualTo(id.toString());
    }

    @Test
    void getSession_returnsEmptyWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        Optional<TypingSessionResponse> result = service.getSession(id.toString());

        assertThat(result).isEmpty();
    }

    @Test
    void submitSession_savesAndReturnsResponse() {
        UUID id = UUID.randomUUID();
        TypingSessionSubmissionRequest request = new TypingSessionSubmissionRequest(
                id.toString(), 70.0, 65.0, 96.0, 2, 350, 336, 60.0, "sample passage",
                "TYPING_TEST", 60, "STANDARD", 0, 0.0
        );

        when(repository.findById(id)).thenReturn(Optional.empty());
        when(gamificationService.calculateBaseXp(336, 60.0)).thenReturn(25);
        when(gamificationService.calculateAdjustedBaseXp(25, 96.0)).thenReturn(30);

        TypingSessionEntity savedEntity = new TypingSessionEntity(
                id, 70.0, 65.0, 96.0, 2, 350, 336, 60.0, "sample passage", Instant.now(),
                "TYPING_TEST", 60, true, 30
        );
        when(repository.save(any(TypingSessionEntity.class))).thenReturn(savedEntity);

        TypingSessionResponse response = service.submitSession(request);

        assertThat(response.id()).isEqualTo(id.toString());
        assertThat(response.netWpm()).isEqualTo(65.0);
        verify(repository).save(any(TypingSessionEntity.class));
        verify(gamificationService).awardReward(any(), any(), eq(id.toString()), eq("SESSION_COMPLETION"), eq(30));
    }

    @Test
    void submitSession_isIdempotent_returnsExistingWhenAlreadySubmitted() {
        UUID id = UUID.randomUUID();
        TypingSessionSubmissionRequest request = new TypingSessionSubmissionRequest(
                id.toString(), 70.0, 65.0, 96.0, 2, 350, 336, 60.0, "sample passage",
                "TYPING_TEST", 60, "STANDARD", 0, 0.0
        );

        TypingSessionEntity existingEntity = new TypingSessionEntity(
                id, 70.0, 65.0, 96.0, 2, 350, 336, 60.0, "sample passage", Instant.now(),
                "TYPING_TEST", 60, true, 30
        );
        when(repository.findById(id)).thenReturn(Optional.of(existingEntity));

        TypingSessionResponse response = service.submitSession(request);

        assertThat(response.id()).isEqualTo(id.toString());
        verify(repository, never()).save(any());
        verify(gamificationService, never()).awardReward(any(), any(), any(), any(), anyInt());
    }

    @Test
    @DisplayName("evaluateBenchmarkEligibility enforces D4 rules: 60s, non-custom corpus, >= 95% Acc, <= 2 pauses, <= 60s paused")
    void testBenchmarkEligibilityRules() {
        // Official qualifying run
        assertThat(service.evaluateBenchmarkEligibility(95.0, 60, "STANDARD", 2, 59.9)).isTrue();
        assertThat(service.evaluateBenchmarkEligibility(98.5, 60, "COMMON_WORDS", 0, 0.0)).isTrue();

        // Disqualified: accuracy < 95.0%
        assertThat(service.evaluateBenchmarkEligibility(94.9, 60, "STANDARD", 0, 0.0)).isFalse();

        // Disqualified: duration != 60s (e.g. 15s sprint or 30s test)
        assertThat(service.evaluateBenchmarkEligibility(99.0, 15, "STANDARD", 0, 0.0)).isFalse();
        assertThat(service.evaluateBenchmarkEligibility(99.0, 30, "STANDARD", 0, 0.0)).isFalse();

        // Disqualified: Custom corpus
        assertThat(service.evaluateBenchmarkEligibility(99.0, 60, "CUSTOM", 0, 0.0)).isFalse();

        // Disqualified: pause count > 2
        assertThat(service.evaluateBenchmarkEligibility(99.0, 60, "STANDARD", 3, 10.0)).isFalse();

        // Disqualified: cumulative pause > 60.0 seconds
        assertThat(service.evaluateBenchmarkEligibility(99.0, 60, "STANDARD", 1, 60.1)).isFalse();
    }
}
