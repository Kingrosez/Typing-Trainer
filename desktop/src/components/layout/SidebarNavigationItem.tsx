import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SidebarNavigationItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
}

export function SidebarNavigationItem({
  icon,
  label,
  href,
  isCollapsed,
}: SidebarNavigationItemProps) {
  const itemContent = (
    <Button
      variant="ghost"
      size={isCollapsed ? "icon" : "default"}
      className={`w-full justify-start h-10 ${!isCollapsed ? "px-3" : "p-2"}`}
      asChild
    >
      <Link to={href}>
        {icon}
        {!isCollapsed && <span className="ml-3">{label}</span>}
      </Link>
    </Button>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
        <TooltipContent side="right" className="w-56">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return itemContent;
}
