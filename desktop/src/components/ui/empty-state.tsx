import type { ReactNode } from "react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/40 my-4 max-w-lg mx-auto">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 shadow-xs">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-6 max-w-md leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}

      {children}
    </div>
  );
}
