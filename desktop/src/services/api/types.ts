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
