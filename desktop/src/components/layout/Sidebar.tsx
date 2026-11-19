import { Button } from "../ui/button";
import {
  Home,
  BookOpen,
  Target,
  Trophy,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Code,
  Gamepad2,
} from "lucide-react";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarNavigationItem } from "./SidebarNavigationItem";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div
      className={`flex flex-col h-full border-r border-border bg-background transition-all duration-200 ${isCollapsed ? "w-17" : "w-60"}`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 rounded-full"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-2 py-4">
        <SidebarGroup title="Overview" isCollapsed={isCollapsed}>
          <SidebarNavigationItem
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            href="/"
            isCollapsed={isCollapsed}
          />
        </SidebarGroup>

        <SidebarGroup title="Practice" isCollapsed={isCollapsed}>
          <SidebarNavigationItem
            icon={<Target className="h-4 w-4" />}
            label="Typing Test"
            href="/typing-test"
            isCollapsed={isCollapsed}
          />
          <SidebarNavigationItem
            icon={<BookOpen className="h-4 w-4" />}
            label="Learning Mode"
            href="/learning-mode"
            isCollapsed={isCollapsed}
          />
          <SidebarNavigationItem
            icon={<Target className="h-4 w-4" />}
            label="Skill Drills"
            href="/skill-drills"
            isCollapsed={isCollapsed}
          />
          <SidebarNavigationItem
            icon={<Code className="h-4 w-4" />}
            label="Developer Mode"
            href="/developer-mode"
            isCollapsed={isCollapsed}
          />
          <SidebarNavigationItem
            icon={<Gamepad2 className="h-4 w-4" />}
            label="Typing Games"
            href="/typing-games"
            isCollapsed={isCollapsed}
          />
        </SidebarGroup>

        <SidebarGroup title="Mastery" isCollapsed={isCollapsed}>
          <SidebarNavigationItem
            icon={<Trophy className="h-4 w-4" />}
            label="Analytics"
            href="/analytics"
            isCollapsed={isCollapsed}
          />
          <SidebarNavigationItem
            icon={<Trophy className="h-4 w-4" />}
            label="Achievements"
            href="/achievements"
            isCollapsed={isCollapsed}
          />
        </SidebarGroup>

        <SidebarGroup title="System" isCollapsed={isCollapsed}>
          <SidebarNavigationItem
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
            href="/settings"
            isCollapsed={isCollapsed}
          />
        </SidebarGroup>
      </nav>

      {/* User Profile Section */}
      <div className="p-2 border-t border-border">
        <SidebarNavigationItem
          icon={<User className="h-4 w-4" />}
          label="Profile"
          href="/profile"
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
}
