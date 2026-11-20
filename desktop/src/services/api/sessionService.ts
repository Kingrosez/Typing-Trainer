import { apiClient } from "./apiClient";
import type { PagedResponse, TypingSessionResponse } from "./types";

export class SessionService {
  /**
   * Fetches paginated typing session records from the local backend.
   * Default sort: completedAt,desc
   */
  public async getRecentSessions(
    page: number = 0,
    size: number = 5,
    sort: string = "completedAt,desc"
  ): Promise<PagedResponse<TypingSessionResponse>> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort,
    });

    return apiClient.get<PagedResponse<TypingSessionResponse>>(
      `/api/v1/sessions?${params.toString()}`,
      {
        requiresAuth: true,
      }
    );
  }
}

export const sessionService = new SessionService();
