import { useState, useEffect } from "react";
import { useTheme } from "../../app/providers/ThemeProvider";
import { useShellStore } from "../../store/useShellStore";
import {
  minimizeWindow,
  toggleMaximizeWindow,
  closeWindow,
  isWindowMaximized,
  isTauriEnvironment,
} from "../../lib/window";
import {
  Keyboard,
  Search,
  Sun,
  Moon,
  Minus,
  Square,
  Copy,
  X,
} from "lucide-react";

interface TitlebarProps {
  title?: string;
}

export function Titlebar({ title = "Typing Trainer" }: TitlebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { toggleCommandPalette } = useShellStore();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const syncMaximized = async () => {
      const maximized = await isWindowMaximized();
      setIsMaximized(maximized);
    };

    syncMaximized();

    if (isTauriEnvironment()) {
      import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
        getCurrentWindow().onResized(() => {
          syncMaximized();
        }).then((unsub) => {
          unlisten = unsub;
        }).catch(() => {
          // ignore listener errors
        });
      }).catch(() => {
        // ignore dynamic import errors
      });
    }

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleDoubleClick = () => {
    toggleMaximizeWindow();
    setIsMaximized((prev) => !prev);
  };

  return (
    <header
      data-tauri-drag-region
      onDoubleClick={handleDoubleClick}
      className="flex items-center justify-between h-[38px] px-3 bg-card border-b border-border select-none shrink-0 z-50 text-xs text-foreground"
    >
      {/* Left: Branding & Offline Status */}
      <div className="flex items-center space-x-2.5" data-tauri-drag-region>
        <div className="flex items-center justify-center w-5 h-5 rounded bg-primary text-primary-foreground shadow-xs">
          <Keyboard className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-xs tracking-tight text-foreground font-sans">
          {title}
        </span>
        <div
          className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-medium"
          title="Standalone Desktop Shell (Phase 1) • Offline Ready"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Offline-Ready</span>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex items-center justify-center flex-1 max-w-sm px-4" data-tauri-drag-region>
        <button
          type="button"
          onClick={toggleCommandPalette}
          className="flex items-center justify-between w-full h-[26px] px-2.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/80 transition-colors text-xs group"
          title="Open Command Palette (Ctrl+K)"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[11px]">Search or jump to...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded bg-background/80 border border-border text-[10px] font-mono font-medium text-muted-foreground shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Theme Toggle & Window Controls */}
      <div className="flex items-center h-full">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center justify-center w-[36px] h-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Theme (Ctrl+Shift+T)`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
          )}
        </button>

        {/* Windows Fluent Window Controls */}
        <div className="flex items-center h-full ml-1">
          {/* Minimize */}
          <button
            type="button"
            onClick={minimizeWindow}
            className="flex items-center justify-center w-[46px] h-full text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Minimize"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            type="button"
            onClick={() => {
              toggleMaximizeWindow();
              setIsMaximized((prev) => !prev);
            }}
            className="flex items-center justify-center w-[46px] h-full text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Copy className="w-3 h-3 rotate-180" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={closeWindow}
            className="flex items-center justify-center w-[46px] h-full text-foreground/80 hover:bg-[#E81123] hover:text-white dark:hover:bg-[#C42B1C] dark:hover:text-white transition-colors"
            aria-label="Close"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
