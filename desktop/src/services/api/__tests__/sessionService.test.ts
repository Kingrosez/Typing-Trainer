import { describe, it, expect, vi, beforeEach } from "vitest";
import { sessionService } from "../sessionService";
import { apiClient } from "../apiClient";
import type { PagedResponse, TypingSessionResponse } from "../types";

vi.mock("../apiClient", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("sessionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches paginated sessions with default parameters", async () => {
    const mockPagedData: PagedResponse<TypingSessionResponse> = {
      items: [
        {
          id: "sess-1",
          grossWpm: 70.0,
          netWpm: 65.0,
          accuracy: 96.0,
          totalErrors: 2,
          rawCharacters: 350,
          correctCharacters: 336,
          durationSeconds: 60.0,
          passage: "Sample",
          completedAt: "2026-11-20T10:00:00Z",
          sessionMode: "TYPING_TEST",
          xpEarned: 35,
          isOfficialBenchmark: true,
        },
      ],
      page: 0,
      size: 5,
      totalItems: 1,
      totalPages: 1,
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockPagedData);

    const result = await sessionService.getRecentSessions();

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/sessions?page=0&size=5&sort=completedAt%2Cdesc",
      { requiresAuth: true }
    );
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.sessionMode).toBe("TYPING_TEST");
    expect(result.items[0]?.xpEarned).toBe(35);
  });

  it("passes custom page and size parameters correctly", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      items: [],
      page: 2,
      size: 10,
      totalItems: 25,
      totalPages: 3,
    });

    const result = await sessionService.getRecentSessions(2, 10, "netWpm,desc");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/sessions?page=2&size=10&sort=netWpm%2Cdesc",
      { requiresAuth: true }
    );
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
  });
});
