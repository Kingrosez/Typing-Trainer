import { useLocation } from "react-router-dom";
import { useTheme } from "../../app/providers/ThemeProvider";
import { useShellStore } from "../../store/useShellStore";
import {
  Volume2,
  VolumeX,
  Keyboard,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  ChevronRight,
} from "lucide-react";

const ROUTE_METADATA: Record<string, { section: string; title: string }> = {
  "/": { section: "Overview", title: "Dashboard" },
  "/dashboard": { section: "Overview", title: "Dashboard" },
  "/typing-test": { section: "Practice Arenas", title: "Typing Test Arena" },
  "/test-selector": { section: "Practice Arenas", title: "Test Mode Selector" },
  "/learning-mode": { section: "Practice Arenas", title: "Interactive Learning Mode" },
  "/skill-drills": { section: "Practice Arenas", title: "Targeted Skill Drills" },
  "/developer-mode": { section: "Practice Arenas", title: "Developer Syntax Arena" },
  "/typing-games": { section: "Practice Arenas", title: "Typing Arcade & Games" },
  "/analytics": { section: "Mastery Telemetry", title: "Performance Analytics" },
  "/achievements": { section: "Mastery Progression", title: "Trophies & Milestones" },
  "/settings": { section: "System Configuration", title: "Application Settings" },
};

export function TopUtilityBar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const {
    mechanicalSoundEnabled,
    toggleMechanicalSound,
    keyboardLayout,
    zenMode,
    toggleZenMode,
  } = useShellStore();

  const meta = ROUTE_METADATA[location.pathname] || {
    section: "Practice",
    title: "Typing Trainer",
  };

  return (
    <div className="flex items-center justify-between h-10 px-6 border-b border-border/80 bg-background/95 backdrop-blur-xs select-none shrink-0 z-30 text-xs">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-muted-foreground">
        <span className="font-medium text-muted-foreground/80">{meta.section}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <span className="font-semibold text-foreground tracking-tight">{meta.title}</span>
      </nav>

      {/* Right Action Utilities */}
      <div className="flex items-center space-x-2">
        {/* Mechanical Sound Toggle */}
        <button
          type="button"
          onClick={toggleMechanicalSound}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors border ${
            mechanicalSoundEnabled
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-secondary/60 text-muted-foreground border-border/60 hover:text-foreground"
          }`}
          title={
            mechanicalSoundEnabled
              ? "Mechanical Key Audio: Enabled (Cherry MX Click)"
              : "Mechanical Key Audio: Muted"
          }
          aria-label="Toggle mechanical sound"
        >
          {mechanicalSoundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-primary" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline font-mono text-[10px]">
            {mechanicalSoundEnabled ? "Cherry MX" : "Mute"}
          </span>
        </button>

        {/* Keyboard Layout Tag */}
        <div
          className="flex items-center space-x-1 px-2 py-1 rounded-md bg-secondary/60 border border-border/60 text-[11px] font-mono font-medium text-muted-foreground"
          title="Current Keyboard Layout"
        >
          <Keyboard className="w-3.5 h-3.5 text-muted-foreground/80" />
          <span>{keyboardLayout}</span>
        </div>

        {/* Theme Toggle Pill */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center space-x-1 px-2 py-1 rounded-md bg-secondary/60 hover:bg-secondary border border-border/60 text-muted-foreground hover:text-foreground transition-colors text-[11px]"
          title={`Toggle Theme (${theme === "dark" ? "Light" : "Dark"})`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline text-[10px]">Midnight</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden lg:inline text-[10px]">Daylight</span>
            </>
          )}
        </button>

        {/* Zen Mode / Distraction Free */}
        <button
          type="button"
          onClick={toggleZenMode}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors border ${
            zenMode
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary/60 text-muted-foreground border-border/60 hover:text-foreground"
          }`}
          title="Toggle Zen Mode (F11)"
          aria-label="Toggle Zen mode"
        >
          {zenMode ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
          <span className="hidden lg:inline text-[10px]">Zen</span>
        </button>
      </div>
    </div>
  );
}
