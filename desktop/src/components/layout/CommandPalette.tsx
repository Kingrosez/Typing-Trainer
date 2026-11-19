import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useShellStore } from "../../store/useShellStore";
import { useTheme } from "../../app/providers/ThemeProvider";
import {
  Search,
  LayoutDashboard,
  Zap,
  GraduationCap,
  Target,
  Code2,
  Gamepad2,
  TrendingUp,
  Trophy,
  Settings,
  Sun,
  Moon,
  Volume2,
  Maximize2,
  PanelLeft,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "Navigation" | "Actions" | "Preferences";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    toggleSidebar,
    toggleMechanicalSound,
    toggleZenMode,
  } = useShellStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-dashboard",
        category: "Navigation",
        title: "Dashboard",
        description: "Overview, stats summary, and recent activity",
        icon: LayoutDashboard,
        shortcut: "Ctrl+1",
        action: () => {
          navigate("/");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-typing-test",
        category: "Navigation",
        title: "Typing Test Arena",
        description: "Standardized speed benchmarks and timed tests",
        icon: Zap,
        shortcut: "Ctrl+2",
        action: () => {
          navigate("/typing-test");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-learning-mode",
        category: "Navigation",
        title: "Learning Mode",
        description: "Structured progressive touch typing curriculum",
        icon: GraduationCap,
        shortcut: "Ctrl+3",
        action: () => {
          navigate("/learning-mode");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-skill-drills",
        category: "Navigation",
        title: "Skill Drills",
        description: "Targeted finger isolation, bigrams, and trigrams",
        icon: Target,
        shortcut: "Ctrl+4",
        action: () => {
          navigate("/skill-drills");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-developer-mode",
        category: "Navigation",
        title: "Developer Mode",
        description: "Programming syntax drills and symbol muscle memory",
        icon: Code2,
        shortcut: "Ctrl+5",
        action: () => {
          navigate("/developer-mode");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-typing-games",
        category: "Navigation",
        title: "Typing Games",
        description: "Arcade games, rhythm typing, and speed challenges",
        icon: Gamepad2,
        shortcut: "Ctrl+6",
        action: () => {
          navigate("/typing-games");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-analytics",
        category: "Navigation",
        title: "Analytics & Telemetry",
        description: "Historical metrics, heatmaps, and finger speed",
        icon: TrendingUp,
        shortcut: "Ctrl+7",
        action: () => {
          navigate("/analytics");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-achievements",
        category: "Navigation",
        title: "Achievements & Trophies",
        description: "Milestones, badges, and mastery rank progress",
        icon: Trophy,
        shortcut: "Ctrl+8",
        action: () => {
          navigate("/achievements");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-settings",
        category: "Navigation",
        title: "Settings",
        description: "Audio, themes, keyboard layouts, and data",
        icon: Settings,
        shortcut: "Ctrl+,",
        action: () => {
          navigate("/settings");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "act-toggle-theme",
        category: "Actions",
        title: `Switch to ${theme === "dark" ? "Daylight (Light)" : "Midnight (Dark)"} Theme`,
        description: "Toggle visual contrast theme between Midnight Slate and Daylight Studio",
        icon: theme === "dark" ? Sun : Moon,
        shortcut: "Ctrl+Shift+T",
        action: () => {
          toggleTheme();
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "act-toggle-sidebar",
        category: "Actions",
        title: "Toggle Navigation Sidebar",
        description: "Expand or collapse the primary navigation sidebar",
        icon: PanelLeft,
        shortcut: "Ctrl+B",
        action: () => {
          toggleSidebar();
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "act-toggle-audio",
        category: "Actions",
        title: "Toggle Mechanical Key Audio",
        description: "Enable or mute Cherry MX mechanical switch sound simulation",
        icon: Volume2,
        action: () => {
          toggleMechanicalSound();
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "act-toggle-zen",
        category: "Actions",
        title: "Toggle Fullscreen Zen Mode",
        description: "Focus mode with minimal peripheral distractions",
        icon: Maximize2,
        shortcut: "F11",
        action: () => {
          toggleZenMode();
          setCommandPaletteOpen(false);
        },
      },
    ],
    [navigate, setCommandPaletteOpen, theme, toggleTheme, toggleSidebar, toggleMechanicalSound, toggleZenMode]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.description.toLowerCase().includes(lower) ||
        c.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isCommandPaletteOpen]);

  // Keyboard navigation within the palette
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setCommandPaletteOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, filteredCommands, selectedIndex, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={() => setCommandPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="w-full max-w-xl mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden select-none animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-card">
          <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search destinations..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching commands found for "{query}"
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-foreground hover:bg-secondary/70"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-medium truncate">{item.title}</div>
                      <div
                        className={`text-[11px] truncate ${
                          isSelected
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd
                      className={`ml-3 shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        isSelected
                          ? "bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground"
                          : "bg-secondary border-border text-muted-foreground"
                      }`}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/40 text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center space-x-2">
            <span>↑↓ to navigate</span>
            <span>•</span>
            <span>↵ to select</span>
          </div>
          <span>Typing Trainer Quick Navigation</span>
        </div>
      </div>
    </div>
  );
}
