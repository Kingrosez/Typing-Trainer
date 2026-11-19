import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { apiClient } from "../services/api/apiClient";
import { healthService } from "../services/api/healthService";
import type { BackendConnectionInfo, ConnectionState } from "../services/api/types";

export interface BackendHealthState {
  state: ConnectionState;
  port: number | null;
  error: string | null;
  lastChecked: Date | null;
  retry: () => void;
}

export function useBackendHealth(): BackendHealthState {
  const [connectionState, setConnectionState] = useState<ConnectionState>("Starting");
  const [port, setPort] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const checkCountRef = useRef(0);

  const initBackendConnection = useCallback(async () => {
    try {
      setConnectionState("Starting");
      setError(null);

      // 1. Attempt to get connection info from Tauri backend supervisor
      let connectionInfo: BackendConnectionInfo;
      try {
        connectionInfo = await invoke<BackendConnectionInfo>("get_backend_connection");
      } catch {
        // If not started yet, instruct Tauri to start backend
        connectionInfo = await invoke<BackendConnectionInfo>("start_backend");
      }

      // 2. Set API client credentials in memory
      apiClient.setConnection(connectionInfo);
      setPort(connectionInfo.port);

      // 3. Verify health via actual endpoint call
      const health = await healthService.checkHealth();
      if (health.status === "UP") {
        setConnectionState("Online");
        setLastChecked(new Date());
        setError(null);
      } else {
        setConnectionState("Error");
        setError(`Unexpected health response status: ${health.status}`);
      }
    } catch (err: unknown) {
      setConnectionState("Offline");
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initBackendConnection();
  }, [initBackendConnection]);

  // Periodic heartbeat every 15 seconds
  useEffect(() => {
    if (connectionState !== "Online") return;

    const interval = setInterval(async () => {
      try {
        const health = await healthService.checkHealth();
        if (health.status === "UP") {
          setLastChecked(new Date());
        } else {
          setConnectionState("Reconnecting");
        }
      } catch {
        checkCountRef.current += 1;
        if (checkCountRef.current > 2) {
          setConnectionState("Offline");
        } else {
          setConnectionState("Reconnecting");
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [connectionState]);

  return {
    state: connectionState,
    port,
    error,
    lastChecked,
    retry: initBackendConnection,
  };
}
