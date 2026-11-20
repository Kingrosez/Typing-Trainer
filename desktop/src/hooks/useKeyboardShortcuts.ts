import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShellStore } from "../store/useShellStore";
import { useTheme } from "../app/providers/ThemeProvider";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleSidebar, toggleCommandPalette, toggleZenMode } = useShellStore();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is actively typing inside an input, textarea, or contentEditable element,
      // or if an accessible modal dialog is currently open
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const isDialogOpen = typeof document !== "undefined" && document.querySelector('[role="dialog"]') !== null;

      const hasCtrl = e.ctrlKey || e.metaKey;

      // 1. Universal Command Palette trigger (Ctrl+K)
      if (hasCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // If active typing in input or modal dialog is active, DO NOT intercept other shortcuts
      if (isInputFocused || isDialogOpen) {
        return;
      }

      // 2. F11 Zen Mode
      if (e.key === "F11") {
        e.preventDefault();
        toggleZenMode();
        return;
      }

      // 3. Ctrl+Shift+T Theme Toggle
      if (hasCtrl && e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // 4. Ctrl+B Sidebar Toggle
      if (hasCtrl && !e.shiftKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // 5. Ctrl+, Settings
      if (hasCtrl && e.key === ",") {
        e.preventDefault();
        navigate("/settings");
        return;
      }

      // 6. Ctrl+1 through Ctrl+8 Primary Destinations
      if (hasCtrl && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            navigate("/");
            break;
          case "2":
            e.preventDefault();
            navigate("/typing-test");
            break;
          case "3":
            e.preventDefault();
            navigate("/learning-mode");
            break;
          case "4":
            e.preventDefault();
            navigate("/skill-drills");
            break;
          case "5":
            e.preventDefault();
            navigate("/developer-mode");
            break;
          case "6":
            e.preventDefault();
            navigate("/typing-games");
            break;
          case "7":
            e.preventDefault();
            navigate("/analytics");
            break;
          case "8":
            e.preventDefault();
            navigate("/achievements");
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, toggleSidebar, toggleCommandPalette, toggleTheme, toggleZenMode]);
}
