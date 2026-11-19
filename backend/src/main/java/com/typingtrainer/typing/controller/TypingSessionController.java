package com.typingtrainer.typing.controller;

import com.typingtrainer.common.response.PagedResponse;
import com.typingtrainer.typing.dto.TypingSessionResponse;
import com.typingtrainer.typing.dto.TypingSessionSubmissionRequest;
import com.typingtrainer.typing.service.TypingSessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sessions")
@Validated
public class TypingSessionController {

    private final TypingSessionService typingSessionService;

    public TypingSessionController(TypingSessionService typingSessionService) {
        this.typingSessionService = typingSessionService;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<TypingSessionResponse>> getRecentSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "completedAt,desc") String sort
    ) {
        return ResponseEntity.ok(typingSessionService.getRecentSessions(page, size, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TypingSessionResponse> getSession(@PathVariable String id) {
        return typingSessionService.getSession(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TypingSessionResponse> submitSession(
            @Valid @RequestBody TypingSessionSubmissionRequest request
    ) {
        TypingSessionResponse response = typingSessionService.submitSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
