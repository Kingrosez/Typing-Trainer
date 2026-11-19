import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SidebarNavigationItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  shortcut?: string;
  badge?: string;
}

export function SidebarNavigationItem({
  icon,
  label,
  href,
  isCollapsed,
  shortcut,
  badge,
}: SidebarNavigationItemProps) {
  const location = useLocation();
  const isActive =
    href === "/"
      ? location.pathname === "/" || location.pathname === "/dashboard"
      : location.pathname.startsWith(href);

  const content = (
    <Link
      to={href}
      className={`group relative flex items-center h-9 px-3 rounded-md text-xs font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isActive
          ? "bg-primary/15 text-primary font-semibold shadow-2xs before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r before:bg-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
      } ${isCollapsed ? "justify-center px-0 w-10 mx-auto" : "w-full space-x-3"}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={`shrink-0 transition-transform duration-150 ${isActive ? "text-primary scale-105" : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"}`}>
        {icon}
      </span>

      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1 min-w-0">
          <span className="truncate">{label}</span>
          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
            {badge && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-primary/20 text-primary">
                {badge}
              </span>
            )}
            {shortcut && (
              <kbd className="hidden group-hover:inline-flex text-[10px] font-mono text-muted-foreground/70 bg-secondary/80 px-1 py-0.2 rounded border border-border/50">
                {shortcut}
              </kbd>
            )}
          </div>
        </div>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center space-x-2 py-1 px-2.5 text-xs font-medium">
          <span>{label}</span>
          {shortcut && (
            <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-muted/60 text-muted-foreground border border-border/50">
              {shortcut}
            </kbd>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
