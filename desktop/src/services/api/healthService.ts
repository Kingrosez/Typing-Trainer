import { apiClient } from "./apiClient";
import type { HealthResponse, SystemInfoResponse } from "./types";

export const healthService = {
  async checkHealth(): Promise<HealthResponse> {
    return apiClient.get<HealthResponse>("/api/v1/health", { timeoutMs: 3000, requiresAuth: false });
  },

  async getSystemInfo(): Promise<SystemInfoResponse> {
    return apiClient.get<SystemInfoResponse>("/api/v1/system/info", { timeoutMs: 4000, requiresAuth: true });
  },
};
