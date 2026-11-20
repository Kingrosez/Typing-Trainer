import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { apiClient, ApiError } from "../apiClient";

describe("ApiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiClient.setConnection({
      port: 54321,
      token: "test-crypto-token-xyz",
      baseUrl: "http://127.0.0.1:54321",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("attaches X-Request-Token header when requiresAuth is true", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "UP", application: "typing-trainer", apiVersion: "v1" }),
    } as Response);

    const result = await apiClient.get<{ status: string }>("/api/v1/health", { requiresAuth: true });

    expect(fetchSpy).toHaveBeenCalledWith("http://127.0.0.1:54321/api/v1/health", expect.objectContaining({
      headers: expect.objectContaining({
        "X-Request-Token": "test-crypto-token-xyz",
      }),
    }));
    expect(result.status).toBe("UP");
  });

  it("omits X-Request-Token header when requiresAuth is false", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "UP" }),
    } as Response);

    await apiClient.get<{ status: string }>("/internal/health", { requiresAuth: false });

    const calledHeaders = (fetchSpy.mock.calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(calledHeaders["X-Request-Token"]).toBeUndefined();
  });

  it("merges custom request headers safely", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response);

    await apiClient.get("/api/v1/dashboard/summary", {
      headers: {
        "X-Timezone": "America/New_York",
        "X-Custom-Client": "TypingTrainerDesktop",
      },
    });

    const calledHeaders = (fetchSpy.mock.calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(calledHeaders["X-Timezone"]).toBe("America/New_York");
    expect(calledHeaders["X-Custom-Client"]).toBe("TypingTrainerDesktop");
    expect(calledHeaders["X-Request-Token"]).toBe("test-crypto-token-xyz");
    expect(calledHeaders["Accept"]).toBe("application/json");
  });

  it("prevents custom headers from overriding X-Request-Token authentication header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response);

    await apiClient.get("/api/v1/dashboard/summary", {
      headers: {
        "X-Request-Token": "attempted-malicious-override",
      },
    });

    const calledHeaders = (fetchSpy.mock.calls[0]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(calledHeaders["X-Request-Token"]).toBe("test-crypto-token-xyz");
  });

  it("handles 401 Unauthorized by parsing standardized ApiErrorResponse", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({
        timestamp: "2026-11-19T14:00:00Z",
        status: 401,
        error: "UNAUTHORIZED",
        message: "Unauthorized local request. Valid X-Request-Token header is required.",
        path: "/api/v1/sessions",
      }),
    } as Response);

    await expect(apiClient.get("/api/v1/sessions")).rejects.toThrow(ApiError);
  });
});
