package com.typingtrainer.typing.service;

import com.typingtrainer.common.response.PagedResponse;
import com.typingtrainer.gamification.service.GamificationService;
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
    private final GamificationService gamificationService;

    public TypingSessionService(TypingSessionRepository typingSessionRepository,
                                GamificationService gamificationService) {
        this.typingSessionRepository = typingSessionRepository;
        this.gamificationService = gamificationService;
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

    /**
     * Determines whether a test session qualifies as an official benchmark for Personal Best records
     * under approved D4 specifications:
     * 1. 15-Second Sprint:
     *    - Duration target == 15
     *    - Standard approved corpus (corpusType != "CUSTOM")
     *    - Accuracy >= 95.0%
     * 2. Official 60-Second Benchmark:
     *    - Duration target == 60
     *    - Standard approved corpus (corpusType != "CUSTOM")
     *    - Accuracy >= 95.0%
     *    - Maximum 2 pause events (pauseCount <= 2)
     *    - Cumulative paused duration <= 60.0s (cumulativePauseSeconds <= 60.0)
     */
    public boolean evaluateBenchmarkEligibility(double accuracy, int durationTarget, String corpusType,
                                                int pauseCount, double cumulativePauseSeconds) {
        if (accuracy < 95.0) return false;
        if ("CUSTOM".equalsIgnoreCase(corpusType)) return false;

        if (durationTarget == 15) {
            return true;
        } else if (durationTarget == 60) {
            if (pauseCount > 2) return false;
            if (cumulativePauseSeconds > 60.0) return false;
            return true;
        }

        return false;
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
        String sessionMode = request.sessionMode() != null ? request.sessionMode() : "TYPING_TEST";
        int durationTarget = request.testDurationTarget() != null ? request.testDurationTarget() : 60;
        String corpusType = request.corpusType() != null ? request.corpusType() : "STANDARD";
        int pauseCount = request.pauseCount() != null ? request.pauseCount() : 0;
        double cumulativePause = request.cumulativePauseSeconds() != null ? request.cumulativePauseSeconds() : 0.0;

        boolean isOfficial = evaluateBenchmarkEligibility(
                request.accuracy(), durationTarget, corpusType, pauseCount, cumulativePause
        );

        int baseXp = gamificationService.calculateBaseXp(request.correctCharacters(), request.durationSeconds());
        int adjustedXp = gamificationService.calculateAdjustedBaseXp(baseXp, request.accuracy());

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
                Instant.now(),
                sessionMode,
                durationTarget,
                isOfficial,
                adjustedXp
        );

        TypingSessionEntity saved = typingSessionRepository.save(entity);

        // Record reward in immutable reward ledger
        String rewardEventId = "SESSION_" + sessionId;
        gamificationService.awardReward(
                GamificationService.DEFAULT_USER_ID,
                rewardEventId,
                sessionId.toString(),
                "SESSION_COMPLETION",
                adjustedXp
        );

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
                entity.getCompletedAt(),
                entity.getSessionMode(),
                entity.getXpEarned(),
                entity.isOfficialBenchmark()
        );
    }
}
