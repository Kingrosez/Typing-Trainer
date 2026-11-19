package com.typingtrainer.typing.service;

import com.typingtrainer.common.response.PagedResponse;
import com.typingtrainer.typing.dto.TypingSessionResponse;
import com.typingtrainer.typing.dto.TypingSessionSubmissionRequest;
import com.typingtrainer.typing.entity.TypingSessionEntity;
import com.typingtrainer.typing.repository.TypingSessionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class TypingSessionService {

    private final TypingSessionRepository typingSessionRepository;

    public TypingSessionService(TypingSessionRepository typingSessionRepository) {
        this.typingSessionRepository = typingSessionRepository;
    }

    public PagedResponse<TypingSessionResponse> getRecentSessions(int page, int size, String sort) {
        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        Sort.Direction direction = sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1])
                ? Sort.Direction.DESC : Sort.Direction.ASC;

        PageRequest pageRequest = PageRequest.of(page, Math.min(size, 100), Sort.by(direction, sortField));
        Page<TypingSessionResponse> responsePage = typingSessionRepository.findAll(pageRequest)
                .map(this::toResponse);
        return PagedResponse.from(responsePage);
    }

    public Optional<TypingSessionResponse> getSession(String id) {
        return typingSessionRepository.findById(UUID.fromString(id))
                .map(this::toResponse);
    }

    @Transactional
    public TypingSessionResponse submitSession(TypingSessionSubmissionRequest request) {
        UUID sessionId = UUID.fromString(request.sessionId());

        // Idempotent: return existing session if already submitted
        Optional<TypingSessionEntity> existing = typingSessionRepository.findById(sessionId);
        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        String passage = request.passage() != null ? request.passage() : "";
        TypingSessionEntity entity = new TypingSessionEntity(
                sessionId,
                request.grossWpm(),
                request.netWpm(),
                request.accuracy(),
                request.totalErrors(),
                request.rawCharacters(),
                request.correctCharacters(),
                request.durationSeconds(),
                passage,
                Instant.now()
        );

        TypingSessionEntity saved = typingSessionRepository.save(entity);
        return toResponse(saved);
    }

    private TypingSessionResponse toResponse(TypingSessionEntity entity) {
        return new TypingSessionResponse(
                entity.getId().toString(),
                entity.getGrossWpm(),
                entity.getNetWpm(),
                entity.getAccuracy(),
                entity.getTotalErrors(),
                entity.getRawCharacters(),
                entity.getCorrectCharacters(),
                entity.getDurationSeconds(),
                entity.getPassage(),
                entity.getCompletedAt()
        );
    }
}
