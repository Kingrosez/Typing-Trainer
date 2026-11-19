import { useState, useEffect } from "react";
import { useTheme } from "../../app/providers/ThemeProvider";
import { Button } from "../ui/button";

interface TitlebarProps {
  title?: string;
}

export function Titlebar({ title = "Typing Trainer" }: TitlebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Check if window is maximized (this would be handled by Tauri)
    // For now, we'll just show a placeholder
    const checkMaximized = () => {
      // In Tauri, this would use window state APIs
      setIsMaximized(false);
    };

    checkMaximized();
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-background border-b border-border h-12">
      <div className="flex items-center space-x-2">
        {/* App Logo - Placeholder */}
        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
          <span className="text-white text-xs font-bold">T</span>
        </div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-full"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </Button>

        {/* Window Controls */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            aria-label="Minimize"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
