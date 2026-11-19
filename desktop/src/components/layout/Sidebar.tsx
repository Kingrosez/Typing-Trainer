import {
  LayoutDashboard,
  Zap,
  GraduationCap,
  Target,
  Code2,
  Gamepad2,
  TrendingUp,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
} from "lucide-react";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarNavigationItem } from "./SidebarNavigationItem";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col h-full border-r border-border bg-card transition-all duration-200 ease-in-out select-none shrink-0 z-40 ${
        isCollapsed ? "w-[68px]" : "w-[240px]"
      }`}
      aria-label="Main Navigation"
    >
      {/* Navigation Links Area */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-3 space-y-1"
        aria-label="Main Navigation"
      >
        {/* Overview */}
        <SidebarGroup title="Overview" isCollapsed={isCollapsed}>
          <SidebarNavigationItem
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Dashboard"
            href="/"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+1"
          />
        </SidebarGroup>

        {/* Practice Arenas */}
        <SidebarGroup title="Practice Arenas" isCollapsed={isCollapsed}>
          <SidebarNavigationItem
            icon={<Zap className="w-4 h-4" />}
            label="Typing Test"
            href="/typing-test"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+2"
            badge="Arena"
          />
          <SidebarNavigationItem
            icon={<GraduationCap className="w-4 h-4" />}
            label="Learning Mode"
            href="/learning-mode"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+3"
          />
          <SidebarNavigationItem
            icon={<Target className="w-4 h-4" />}
            label="Skill Drills"
            href="/skill-drills"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+4"
          />
          <SidebarNavigationItem
            icon={<Code2 className="w-4 h-4" />}
            label="Developer Mode"
            href="/developer-mode"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+5"
          />
          <SidebarNavigationItem
            icon={<Gamepad2 className="w-4 h-4" />}
            label="Typing Games"
            href="/typing-games"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+6"
          />
        </SidebarGroup>

        {/* Mastery */}
        <SidebarGroup title="Mastery" isCollapsed={isCollapsed}>
          <SidebarNavigationItem
            icon={<TrendingUp className="w-4 h-4" />}
            label="Analytics"
            href="/analytics"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+7"
          />
          <SidebarNavigationItem
            icon={<Trophy className="w-4 h-4" />}
            label="Achievements"
            href="/achievements"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+8"
          />
        </SidebarGroup>

        {/* System */}
        <SidebarGroup title="System" isCollapsed={isCollapsed}>
          <SidebarNavigationItem
            icon={<Settings className="w-4 h-4" />}
            label="Settings"
            href="/settings"
            isCollapsed={isCollapsed}
            shortcut="Ctrl+,"
          />
        </SidebarGroup>
      </nav>

      {/* User Progress & Streak Card (D1 Section 2.2) */}
      <div className="p-2 border-t border-border bg-card/60">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-lg bg-secondary/60 border border-border/80 mb-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary">
                  <Award className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-foreground">
                  Level 1 • Novice
                </span>
              </div>
              <div
                className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono text-[11px] font-medium"
                title="Daily practice streak unstarted"
              >
                <Flame className="w-3.5 h-3.5 text-muted-foreground" />
                <span>0d</span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>XP: 0 / 100</span>
                <span>0%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/40 transition-all duration-300"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-2 mb-2 space-y-1 text-center"
            title="Level 1 Novice • 0d streak (0% XP)"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-muted-foreground border border-border">
              <Flame className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              0d
            </span>
          </div>
        )}

        {/* Sidebar Collapse Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-full h-8 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-ring"
          aria-label={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-[11px]">Collapse sidebar</span>
              <div className="flex items-center space-x-1">
                <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-background border border-border text-muted-foreground">
                  Ctrl B
                </kbd>
                <ChevronLeft className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
