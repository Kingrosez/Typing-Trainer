import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { apiClient, ApiError } from "../apiClient";
import { dashboardService } from "../dashboardService";
import type { DashboardSummaryResponse, DailyGoalDto } from "../dashboardTypes";

describe("DashboardService", () => {
  const mockValidSummaryResponse: DashboardSummaryResponse = {
    userStatus: {
      displayName: "Alex",
      currentLevel: 12,
      currentTier: "Apprentice",
      totalXp: 2450,
      xpProgressInLevel: 450,
      xpRequiredForNextLevel: 1000,
      currentStreakDays: 5,
      longestStreakDays: 14,
      freezeShieldsAvailable: 2,
    },
    dailyGoal: {
      targetMinutes: 20,
      completedSecondsToday: 720,
      remainingSecondsToday: 480,
      progressPercentage: 60.0,
      isCompletedToday: false,
    },
    primaryMetrics: {
      bestWpm: 72.5,
      averageWpm: 58.3,
      accuracy: 96.4,
      totalPracticeSeconds: 3600,
      completedSessionCount: 25,
      currentSessionWpm: 64.0,
    },
    weeklyActivity: [
      { dayOfWeek: "Mon", date: "2026-11-16", durationSeconds: 1200, goalMet: true, isToday: false },
      { dayOfWeek: "Tue", date: "2026-11-17", durationSeconds: 1400, goalMet: true, isToday: false },
      { dayOfWeek: "Wed", date: "2026-11-18", durationSeconds: 600, goalMet: false, isToday: false },
      { dayOfWeek: "Thu", date: "2026-11-19", durationSeconds: 1500, goalMet: true, isToday: false },
      { dayOfWeek: "Fri", date: "2026-11-20", durationSeconds: 720, goalMet: false, isToday: true },
      { dayOfWeek: "Sat", date: "2026-11-21", durationSeconds: 0, goalMet: false, isToday: false },
      { dayOfWeek: "Sun", date: "2026-11-22", durationSeconds: 0, goalMet: false, isToday: false },
    ],
    wpmTrend: [
      {
        sessionId: "sess-1",
        netWpm: 54.0,
        grossWpm: 58.0,
        accuracy: 94.5,
        totalErrors: 3,
        completedAt: "2026-11-18T10:00:00Z",
      },
      {
        sessionId: "sess-2",
        netWpm: 62.0,
        grossWpm: 65.0,
        accuracy: 96.8,
        totalErrors: 2,
        completedAt: "2026-11-19T14:30:00Z",
      },
    ],
    weakKeyRecommendations: [
      {
        keyChar: "r",
        errorRate: 0.12,
        accuracy: 88.0,
        opportunities: 45,
        errors: 5,
        wpi: 0.45,
        tier: "HIGH_PRIORITY",
        explanation: "Key 'r' has an error rate of 12.0% across recent sessions.",
      },
    ],
    personalBests: {
      best15sWpm: 84.0,
      best60sWpm: 72.5,
      bestDevModeWpm: 58.0,
      longestSessionSeconds: 1800.0,
    },
    recentSessions: [
      {
        id: "sess-2",
        sessionMode: "STANDARD_BENCHMARK",
        netWpm: 62.0,
        grossWpm: 65.0,
        accuracy: 96.8,
        totalErrors: 2,
        durationSeconds: 60.0,
        xpEarned: 110,
        completedAt: "2026-11-19T14:30:00Z",
      },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    apiClient.setConnection({
      port: 54321,
      token: "secret-token-12345",
      baseUrl: "http://127.0.0.1:54321",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("successfully retrieves dashboard summary", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockValidSummaryResponse,
    } as Response);

    const data = await dashboardService.getDashboardSummary();

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://127.0.0.1:54321/api/v1/dashboard/summary",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "X-Request-Token": "secret-token-12345",
          "Accept": "application/json",
        }),
      })
    );
    expect(data.userStatus.displayName).toBe("Alex");
    expect(data.userStatus.currentLevel).toBe(12);
    expect(data.dailyGoal.targetMinutes).toBe(20);
    expect(data.primaryMetrics.bestWpm).toBe(72.5);
    expect(data.weeklyActivity).toHaveLength(7);
    expect(data.wpmTrend).toHaveLength(2);
    expect(data.weakKeyRecommendations[0]?.keyChar).toBe("r");
    expect(data.personalBests.best60sWpm).toBe(72.5);
    expect(data.recentSessions).toHaveLength(1);
  });

  it("propagates default local IANA timezone through X-Timezone header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockValidSummaryResponse,
    } as Response);

    await dashboardService.getDashboardSummary();

    const calledHeaders = (fetchSpy.mock.calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
    const expectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    expect(calledHeaders["X-Timezone"]).toBe(expectedTz);
  });

  it("propagates explicit timezone parameter through X-Timezone header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockValidSummaryResponse,
    } as Response);

    await dashboardService.getDashboardSummary("Asia/Tokyo");

    const calledHeaders = (fetchSpy.mock.calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(calledHeaders["X-Timezone"]).toBe("Asia/Tokyo");
  });

  it("successfully updates daily practice goal", async () => {
    const updatedGoalDto: DailyGoalDto = {
      targetMinutes: 30,
      completedSecondsToday: 720,
      remainingSecondsToday: 1080,
      progressPercentage: 40.0,
      isCompletedToday: false,
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => updatedGoalDto,
    } as Response);

    const result = await dashboardService.updateDailyGoal({ targetMinutes: 30 }, "America/Chicago");

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://127.0.0.1:54321/api/v1/dashboard/daily-goal",
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          "X-Request-Token": "secret-token-12345",
          "X-Timezone": "America/Chicago",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ targetMinutes: 30 }),
      })
    );
    expect(result.targetMinutes).toBe(30);
    expect(result.remainingSecondsToday).toBe(1080);
  });

  it("handles backend validation errors (HTTP 400 Bad Request)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({
        timestamp: "2026-11-20T12:00:00Z",
        status: 400,
        error: "BAD_REQUEST",
        message: "Daily goal cannot exceed 120 minutes",
        path: "/api/v1/dashboard/daily-goal",
      }),
    } as Response);

    await expect(dashboardService.updateDailyGoal({ targetMinutes: 180 })).rejects.toThrow(ApiError);

    try {
      await dashboardService.updateDailyGoal({ targetMinutes: 180 });
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.apiError.status).toBe(400);
      expect(apiErr.apiError.message).toBe("Daily goal cannot exceed 120 minutes");
    }
  });

  it("handles unauthorized requests (HTTP 401 Unauthorized)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({
        timestamp: "2026-11-20T12:00:00Z",
        status: 401,
        error: "UNAUTHORIZED",
        message: "Unauthorized local request. Valid X-Request-Token header is required.",
        path: "/api/v1/dashboard/summary",
      }),
    } as Response);

    await expect(dashboardService.getDashboardSummary()).rejects.toThrow(ApiError);
  });

  it("handles backend connection uninitialized error", async () => {
    // Reset connection info to null
    (apiClient as unknown as { connection: null }).connection = null;

    await expect(dashboardService.getDashboardSummary()).rejects.toThrow(
      "Cannot send request: Local backend connection has not been initialized"
    );
  });

  it("handles network timeout error (AbortError)", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";
      return Promise.reject(abortError);
    });

    await expect(dashboardService.getDashboardSummary()).rejects.toThrow(/timed out/);
  });

  it("handles network failure error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Failed to fetch"));

    await expect(dashboardService.getDashboardSummary()).rejects.toThrow(
      "Network failure calling /api/v1/dashboard/summary: Failed to fetch"
    );
  });

  it("preserves null and empty fields in zero-state responses", async () => {
    const zeroStateResponse: DashboardSummaryResponse = {
      userStatus: {
        displayName: "New User",
        currentLevel: 1,
        currentTier: "Novice",
        totalXp: 0,
        xpProgressInLevel: 0,
        xpRequiredForNextLevel: 120,
        currentStreakDays: 0,
        longestStreakDays: 0,
        freezeShieldsAvailable: 0,
      },
      dailyGoal: {
        targetMinutes: 20,
        completedSecondsToday: 0,
        remainingSecondsToday: 1200,
        progressPercentage: 0.0,
        isCompletedToday: false,
      },
      primaryMetrics: {
        bestWpm: null,
        averageWpm: null,
        accuracy: null,
        totalPracticeSeconds: 0,
        completedSessionCount: 0,
        currentSessionWpm: null,
      },
      weeklyActivity: [],
      wpmTrend: [],
      weakKeyRecommendations: [],
      personalBests: {
        best15sWpm: null,
        best60sWpm: null,
        bestDevModeWpm: null,
        longestSessionSeconds: null,
      },
      recentSessions: [],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => zeroStateResponse,
    } as Response);

    const data = await dashboardService.getDashboardSummary();

    expect(data.primaryMetrics.bestWpm).toBeNull();
    expect(data.primaryMetrics.averageWpm).toBeNull();
    expect(data.primaryMetrics.accuracy).toBeNull();
    expect(data.primaryMetrics.currentSessionWpm).toBeNull();
    expect(data.personalBests.best15sWpm).toBeNull();
    expect(data.personalBests.best60sWpm).toBeNull();
    expect(data.personalBests.bestDevModeWpm).toBeNull();
    expect(data.personalBests.longestSessionSeconds).toBeNull();
    expect(data.weeklyActivity).toEqual([]);
    expect(data.wpmTrend).toEqual([]);
    expect(data.weakKeyRecommendations).toEqual([]);
    expect(data.recentSessions).toEqual([]);
  });
});
