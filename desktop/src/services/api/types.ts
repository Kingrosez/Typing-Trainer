export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface BackendConnectionInfo {
  port: number;
  token: string;
  baseUrl: string;
}

export interface HealthResponse {
  status: string;
  application: string;
  apiVersion: string;
}

export interface SystemInfoResponse {
  application: string;
  version: string;
  status: string;
  database: string;
  offlineReady: boolean;
}

export type ConnectionState = "Starting" | "Online" | "Reconnecting" | "Offline" | "Error";

export interface RequestOptions {
  timeoutMs?: number;
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface TypingSessionResponse {
  id: string;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalErrors: number;
  rawCharacters: number;
  correctCharacters: number;
  durationSeconds: number;
  passage: string;
  completedAt: string;
  sessionMode: string;
  xpEarned: number;
  isOfficialBenchmark: boolean;
}
