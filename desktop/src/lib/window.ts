/**
 * Window management utilities for Tauri 2 desktop shell.
 * Provides safe fallback for web/test environments.
 */

export const isTauriEnvironment = (): boolean => {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
};

export async function minimizeWindow(): Promise<void> {
  if (isTauriEnvironment()) {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().minimize();
    } catch (err) {
      console.warn("Failed to minimize window:", err);
    }
  } else {
    console.info("[Web Fallback] Window minimize requested");
  }
}

export async function toggleMaximizeWindow(): Promise<void> {
  if (isTauriEnvironment()) {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().toggleMaximize();
    } catch (err) {
      console.warn("Failed to toggle maximize window:", err);
    }
  } else {
    console.info("[Web Fallback] Window toggle maximize requested");
  }
}

export async function closeWindow(): Promise<void> {
  if (isTauriEnvironment()) {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().close();
    } catch (err) {
      console.warn("Failed to close window:", err);
    }
  } else {
    console.info("[Web Fallback] Window close requested");
  }
}

export async function isWindowMaximized(): Promise<boolean> {
  if (isTauriEnvironment()) {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      return await getCurrentWindow().isMaximized();
    } catch {
      return false;
    }
  }
  return false;
}
