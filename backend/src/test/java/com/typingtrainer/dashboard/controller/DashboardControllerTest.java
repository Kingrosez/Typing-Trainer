package com.typingtrainer.dashboard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.typingtrainer.config.RequestTokenFilter;
import com.typingtrainer.dashboard.dto.DailyGoalUpdateRequest;
import com.typingtrainer.dashboard.dto.DashboardSummaryResponse;
import com.typingtrainer.dashboard.dto.DashboardSummaryResponse.*;
import com.typingtrainer.dashboard.service.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.ZoneId;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DashboardController.class)
@AutoConfigureMockMvc(addFilters = false)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private DashboardService dashboardService;

    @MockitoBean
    private RequestTokenFilter requestTokenFilter;

    @Test
    @DisplayName("GET /api/v1/dashboard/summary returns full dashboard model for new user")
    void testGetDashboardSummary() throws Exception {
        UserStatusDto userStatus = new UserStatusDto("Typist", 1, "Novice", 0, 0, 120, 0, 0, 0);
        DailyGoalDto dailyGoal = new DailyGoalDto(20, 0, 1200, 0.0, false);
        PrimaryMetricsDto primaryMetrics = new PrimaryMetricsDto(null, null, null, 0.0, 0L, null);
        PersonalBestsDto personalBests = new PersonalBestsDto(null, null, null, null);

        DashboardSummaryResponse summary = new DashboardSummaryResponse(
                userStatus,
                dailyGoal,
                primaryMetrics,
                List.of(),
                List.of(),
                List.of(),
                personalBests,
                List.of()
        );

        when(dashboardService.getDashboardSummary(any(ZoneId.class))).thenReturn(summary);

        mockMvc.perform(get("/api/v1/dashboard/summary")
                        .header("X-Timezone", "UTC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userStatus.currentLevel").value(1))
                .andExpect(jsonPath("$.userStatus.currentTier").value("Novice"))
                .andExpect(jsonPath("$.dailyGoal.targetMinutes").value(20))
                .andExpect(jsonPath("$.dailyGoal.isCompletedToday").value(false))
                .andExpect(jsonPath("$.primaryMetrics.completedSessionCount").value(0));
    }

    @Test
    @DisplayName("PUT /api/v1/dashboard/daily-goal validates targetMinutes")
    void testUpdateDailyGoal() throws Exception {
        DailyGoalDto updatedGoal = new DailyGoalDto(30, 0, 1800, 0.0, false);
        when(dashboardService.updateDailyGoal(any(DailyGoalUpdateRequest.class), any(ZoneId.class))).thenReturn(updatedGoal);

        DailyGoalUpdateRequest request = new DailyGoalUpdateRequest(30);

        mockMvc.perform(put("/api/v1/dashboard/daily-goal")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .header("X-Timezone", "UTC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.targetMinutes").value(30))
                .andExpect(jsonPath("$.remainingSecondsToday").value(1800));
    }
}
