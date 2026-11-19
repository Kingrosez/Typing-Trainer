import { useTheme } from "../../app/providers/ThemeProvider";

export function StatusBar() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-secondary border-t border-border text-xs">
      <div className="flex items-center space-x-4">
        <span>Typing Trainer v0.1.0</span>
        <span>Offline</span>
      </div>

      <div className="flex items-center space-x-4">
        <span>Theme: {theme}</span>
        <span>Ready</span>
      </div>
    </div>
  );
}
