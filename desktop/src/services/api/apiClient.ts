import type { ApiErrorResponse, BackendConnectionInfo, RequestOptions } from "./types";

class ApiClient {
  private connection: BackendConnectionInfo | null = null;
  private defaultTimeoutMs: number = 8000;

  public setConnection(info: BackendConnectionInfo) {
    this.connection = info;
  }

  public getConnection(): BackendConnectionInfo | null {
    return this.connection;
  }

  public isConnected(): boolean {
    return this.connection !== null;
  }

  public async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  public async post<T, B = unknown>(path: string, body?: B, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  public async put<T, B = unknown>(path: string, body?: B, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  public async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const requiresAuth = options.requiresAuth ?? true;
    const timeoutMs = options.timeoutMs ?? this.defaultTimeoutMs;

    if (!this.connection) {
      throw new Error("Cannot send request: Local backend connection has not been initialized");
    }

    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${this.connection.baseUrl}${cleanPath}`;

    const headers: Record<string, string> = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    };

    if (requiresAuth && this.connection.token) {
      headers["X-Request-Token"] = this.connection.token;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        let errorData: ApiErrorResponse;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            timestamp: new Date().toISOString(),
            status: response.status,
            error: response.statusText || "HTTP_ERROR",
            message: `Request failed with HTTP status ${response.status}`,
            path: cleanPath,
          };
        }
        throw new ApiError(errorData);
      }

      if (response.status === 204) {
        return null as unknown as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof ApiError) {
        throw err;
      }
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Request to ${cleanPath} timed out after ${timeoutMs}ms`);
      }
      throw new Error(`Network failure calling ${cleanPath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

export class ApiError extends Error {
  public readonly apiError: ApiErrorResponse;

  constructor(error: ApiErrorResponse) {
    super(error.message || `API error ${error.status}: ${error.error}`);
    this.name = "ApiError";
    this.apiError = error;
  }
}

export const apiClient = new ApiClient();
