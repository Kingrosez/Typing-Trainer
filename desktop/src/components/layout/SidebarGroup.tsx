import type { ReactNode } from "react";

interface SidebarGroupProps {
  title: string;
  isCollapsed: boolean;
  children: ReactNode;
}

export function SidebarGroup({
  title,
  isCollapsed,
  children,
}: SidebarGroupProps) {
  if (isCollapsed) {
    return <>{children}</>;
  }

  return (
    <div className="mb-4">
      <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1 px-2">{children}</div>
    </div>
  );
}
