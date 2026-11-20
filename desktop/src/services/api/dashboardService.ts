import { apiClient } from "./apiClient";
import type {
  DashboardSummaryResponse,
  DailyGoalDto,
  DailyGoalUpdateRequest,
} from "./dashboardTypes";

export class DashboardService {
  /**
   * Resolves the current IANA timezone name (e.g. "America/New_York", "Asia/Kolkata").
   * Falls back to "UTC" if resolution fails or returns empty.
   */
  public resolveTimezone(overrideTimezone?: string): string {
    if (overrideTimezone && overrideTimezone.trim().length > 0) {
      return overrideTimezone.trim();
    }
    try {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return resolved && resolved.trim().length > 0 ? resolved.trim() : "UTC";
    } catch {
      return "UTC";
    }
  }

  /**
   * Fetches the comprehensive dashboard summary payload.
   * Propagates the user's IANA timezone via the X-Timezone header.
   */
  public async getDashboardSummary(timezone?: string): Promise<DashboardSummaryResponse> {
    const tz = this.resolveTimezone(timezone);
    return apiClient.get<DashboardSummaryResponse>("/api/v1/dashboard/summary", {
      headers: {
        "X-Timezone": tz,
      },
      requiresAuth: true,
    });
  }

  /**
   * Updates the user's daily practice goal target in minutes.
   * Propagates the user's IANA timezone via the X-Timezone header and returns updated goal progress.
   */
  public async updateDailyGoal(
    request: DailyGoalUpdateRequest,
    timezone?: string
  ): Promise<DailyGoalDto> {
    const tz = this.resolveTimezone(timezone);
    return apiClient.put<DailyGoalDto, DailyGoalUpdateRequest>(
      "/api/v1/dashboard/daily-goal",
      request,
      {
        headers: {
          "X-Timezone": tz,
        },
        requiresAuth: true,
      }
    );
  }
}

export const dashboardService = new DashboardService();
