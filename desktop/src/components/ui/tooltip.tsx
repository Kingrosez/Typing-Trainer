import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue>({
  open: false,
  setOpen: () => {},
});

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  );
}

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild = false, children, ...props }, ref) => {
  const { setOpen } = React.useContext(TooltipContext);

  const handlers = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        ...handlers,
        ...props,
        ref,
      },
    );
  }

  return (
    <button ref={ref} {...handlers} {...props}>
      {children}
    </button>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

function TooltipContent({
  className,
  side = "top",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  const { open } = React.useContext(TooltipContext);

  if (!open) return null;

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  };

  return (
    <div
      role="tooltip"
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0",
        sideClasses[side],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
