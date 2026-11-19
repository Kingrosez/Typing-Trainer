package com.typingtrainer.typing.service;

import com.typingtrainer.common.response.PagedResponse;
import com.typingtrainer.typing.dto.TypingSessionResponse;
import com.typingtrainer.typing.dto.TypingSessionSubmissionRequest;
import com.typingtrainer.typing.entity.TypingSessionEntity;
import com.typingtrainer.typing.repository.TypingSessionRepository;
import org.junit.jupiter.api.BeforeEach;
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

    private TypingSessionService service;

    @BeforeEach
    void setUp() {
        service = new TypingSessionService(repository);
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
        assertThat(result.items().getFirst().id()).isEqualTo(id.toString());
        assertThat(result.items().getFirst().grossWpm()).isEqualTo(70.0);
        assertThat(result.page()).isEqualTo(0);
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
    void getSession_returnsEmptyWhenNotExists() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        Optional<TypingSessionResponse> result = service.getSession(id.toString());

        assertThat(result).isEmpty();
    }

    @Test
    void submitSession_savesNewSession() {
        UUID id = UUID.randomUUID();
        TypingSessionSubmissionRequest request = new TypingSessionSubmissionRequest(
                id.toString(), 75.0, 70.0, 98.0, 1, 380, 372, 60.0, "sample passage"
        );

        when(repository.findById(id)).thenReturn(Optional.empty());
        when(repository.save(any(TypingSessionEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TypingSessionResponse result = service.submitSession(request);

        assertThat(result.id()).isEqualTo(id.toString());
        assertThat(result.grossWpm()).isEqualTo(75.0);
        assertThat(result.netWpm()).isEqualTo(70.0);
        assertThat(result.accuracy()).isEqualTo(98.0);
        verify(repository).save(any(TypingSessionEntity.class));
    }

    @Test
    void submitSession_isIdempotentForExistingSession() {
        UUID id = UUID.randomUUID();
        TypingSessionEntity existing = new TypingSessionEntity(
                id, 70.0, 65.0, 96.0, 2, 350, 336, 60.0, "old text", Instant.now()
        );
        TypingSessionSubmissionRequest request = new TypingSessionSubmissionRequest(
                id.toString(), 99.0, 99.0, 99.0, 0, 500, 500, 60.0, "new text"
        );

        when(repository.findById(id)).thenReturn(Optional.of(existing));

        TypingSessionResponse result = service.submitSession(request);

        assertThat(result.id()).isEqualTo(id.toString());
        assertThat(result.grossWpm()).isEqualTo(70.0); // original value preserved
        verify(repository, never()).save(any());
    }
}
