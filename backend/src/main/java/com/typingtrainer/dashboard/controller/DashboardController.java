package com.typingtrainer.dashboard.controller;

import com.typingtrainer.dashboard.dto.DailyGoalUpdateRequest;
import com.typingtrainer.dashboard.dto.DashboardSummaryResponse;
import com.typingtrainer.dashboard.dto.DashboardSummaryResponse.DailyGoalDto;
import com.typingtrainer.dashboard.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;

@RestController
@RequestMapping("/api/v1/dashboard")
@Validated
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @RequestHeader(value = "X-Timezone", required = false) String timezoneHeader
    ) {
        ZoneId zone = resolveZone(timezoneHeader);
        return ResponseEntity.ok(dashboardService.getDashboardSummary(zone));
    }

    @PutMapping("/daily-goal")
    public ResponseEntity<DailyGoalDto> updateDailyGoal(
            @Valid @RequestBody DailyGoalUpdateRequest request,
            @RequestHeader(value = "X-Timezone", required = false) String timezoneHeader
    ) {
        ZoneId zone = resolveZone(timezoneHeader);
        return ResponseEntity.ok(dashboardService.updateDailyGoal(request, zone));
    }

    private ZoneId resolveZone(String timezoneHeader) {
        if (timezoneHeader != null && !timezoneHeader.isBlank()) {
            try {
                return ZoneId.of(timezoneHeader);
            } catch (Exception ignored) {
                // fallback to system default
            }
        }
        return ZoneId.systemDefault();
    }
}
