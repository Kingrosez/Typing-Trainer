package com.typingtrainer.typing.controller;

import com.typingtrainer.common.response.PagedResponse;
import com.typingtrainer.typing.dto.TypingSessionResponse;
import com.typingtrainer.typing.service.TypingSessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TypingSessionController.class)
class TypingSessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TypingSessionService typingSessionService;

    @Test
    void getRecentSessions_returnsPagedResponse() throws Exception {
        TypingSessionResponse session = new TypingSessionResponse(
                UUID.randomUUID().toString(), 65.0, 60.0, 95.5,
                3, 300, 285, 60.0, "test passage", Instant.now()
        );
        PagedResponse<TypingSessionResponse> pagedResponse = new PagedResponse<>(
                List.of(session), 0, 20, 1, 1
        );

        when(typingSessionService.getRecentSessions(anyInt(), anyInt(), anyString()))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/v1/sessions")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.totalPages").value(1));
    }

    @Test
    void getSession_returnsSessionWhenFound() throws Exception {
        String sessionId = UUID.randomUUID().toString();
        TypingSessionResponse session = new TypingSessionResponse(
                sessionId, 65.0, 60.0, 95.5,
                3, 300, 285, 60.0, "test passage", Instant.now()
        );

        when(typingSessionService.getSession(sessionId))
                .thenReturn(Optional.of(session));

        mockMvc.perform(get("/api/v1/sessions/{id}", sessionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionId))
                .andExpect(jsonPath("$.grossWpm").value(65.0));
    }

    @Test
    void getSession_returns404WhenNotFound() throws Exception {
        String sessionId = UUID.randomUUID().toString();

        when(typingSessionService.getSession(sessionId))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/sessions/{id}", sessionId))
                .andExpect(status().isNotFound());
    }

    @Test
    void submitSession_createsNewSession() throws Exception {
        String sessionId = UUID.randomUUID().toString();
        TypingSessionResponse response = new TypingSessionResponse(
                sessionId, 65.0, 60.0, 95.5,
                3, 300, 285, 60.0, "test passage", Instant.now()
        );

        when(typingSessionService.submitSession(any()))
                .thenReturn(response);

        String requestBody = """
                {
                    "sessionId": "%s",
                    "grossWpm": 65.0,
                    "netWpm": 60.0,
                    "accuracy": 95.5,
                    "totalErrors": 3,
                    "rawCharacters": 300,
                    "correctCharacters": 285,
                    "durationSeconds": 60.0,
                    "passage": "test passage"
                }
                """.formatted(sessionId);

        mockMvc.perform(post("/api/v1/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(sessionId));
    }

    @Test
    void submitSession_rejectsInvalidRequest() throws Exception {
        String requestBody = """
                {
                    "sessionId": "",
                    "grossWpm": -1,
                    "netWpm": 60.0,
                    "accuracy": 95.5,
                    "totalErrors": 3,
                    "rawCharacters": 300,
                    "correctCharacters": 285,
                    "durationSeconds": 60.0,
                    "passage": ""
                }
                """;

        mockMvc.perform(post("/api/v1/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }
}
