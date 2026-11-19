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
    return (
      <div className="py-2 border-b border-border/40 last:border-b-0 space-y-1">
        {children}
      </div>
    );
  }

  return (
    <div className="mb-4 last:mb-0">
      <h3 className="px-3 mb-1 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider font-sans">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
