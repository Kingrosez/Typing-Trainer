import { useTheme } from "../../app/providers/ThemeProvider";
import { useBackendHealth } from "../../hooks/useBackendHealth";
import { Database, ShieldCheck, Zap, Activity } from "lucide-react";

export function StatusBar() {
  const { theme } = useTheme();
  const { state: backendState, port, error: backendError } = useBackendHealth();

  const getStatusColor = () => {
    switch (backendState) {
      case "Online":
        return "text-emerald-500";
      case "Starting":
      case "Reconnecting":
        return "text-amber-500 animate-pulse";
      case "Offline":
      case "Error":
      default:
        return "text-rose-500";
    }
  };

  return (
    <footer
      className="flex items-center justify-between h-8 px-4 bg-card border-t border-border/80 select-none shrink-0 z-30 text-[11px] text-muted-foreground font-sans"
      aria-label="Application Status Bar"
    >
      {/* Left: Keyboard Accelerator Hints */}
      <div className="flex items-center space-x-3 text-muted-foreground/80 overflow-hidden">
        <div className="flex items-center space-x-1.5 shrink-0">
          <kbd className="px-1.5 py-0.2 rounded bg-secondary/80 border border-border/60 font-mono text-[10px] text-foreground/80 font-medium">
            Ctrl K
          </kbd>
          <span className="hidden sm:inline">Menu</span>
        </div>

        <span className="text-border hidden sm:inline">•</span>

        <div className="flex items-center space-x-1.5 shrink-0">
          <kbd className="px-1.5 py-0.2 rounded bg-secondary/80 border border-border/60 font-mono text-[10px] text-foreground/80 font-medium">
            Ctrl B
          </kbd>
          <span className="hidden md:inline">Sidebar</span>
        </div>

        <span className="text-border hidden md:inline">•</span>

        <div className="flex items-center space-x-1.5 shrink-0">
          <kbd className="px-1.5 py-0.2 rounded bg-secondary/80 border border-border/60 font-mono text-[10px] text-foreground/80 font-medium">
            Ctrl 1..8
          </kbd>
          <span className="hidden lg:inline">Arenas</span>
        </div>

        <span className="text-border hidden lg:inline">•</span>

        <div className="flex items-center space-x-1.5 shrink-0">
          <kbd className="px-1.5 py-0.2 rounded bg-secondary/80 border border-border/60 font-mono text-[10px] text-foreground/80 font-medium">
            Ctrl ,
          </kbd>
          <span className="hidden lg:inline">Settings</span>
        </div>
      </div>

      {/* Center: System Status Tag */}
      <div className="hidden xl:flex items-center space-x-1.5 text-muted-foreground font-medium text-[11px]">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Typing Trainer Desktop Shell (Phase 1)</span>
      </div>

      {/* Right: Runtime State & Persistence */}
      <div className="flex items-center space-x-3 font-mono text-[10px]">
        {/* Backend State */}
        <div
          className="flex items-center space-x-1"
          title={backendError ? `Backend error: ${backendError}` : `Local backend status: ${backendState}`}
        >
          <Activity className={`w-3 h-3 ${getStatusColor()}`} />
          <span className="text-foreground/80">
            Backend: <span className={getStatusColor()}>{backendState}</span>
            {port ? ` (${port})` : ""}
          </span>
        </div>

        <span className="text-border">•</span>

        {/* Local Persistence Status */}
        <div
          className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400"
          title="Local SQLite database ready in offline mode"
        >
          <Database className="w-3 h-3 text-emerald-500" />
          <span className="hidden sm:inline">SQLite: Ready</span>
        </div>

        <span className="text-border">•</span>

        {/* Latency */}
        <div
          className="flex items-center space-x-1 text-foreground/80"
          title="Input latency: zero network overhead (processed in-memory)"
        >
          <Zap className="w-3 h-3 text-blue-500" />
          <span>0ms Latency</span>
        </div>

        <span className="text-border">•</span>

        {/* Theme badge */}
        <div className="capitalize text-muted-foreground">
          {theme}
        </div>
      </div>
    </footer>
  );
}
