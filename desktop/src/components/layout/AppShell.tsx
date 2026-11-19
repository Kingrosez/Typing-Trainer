import { useShellStore } from "../../store/useShellStore";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { Titlebar } from "./Titlebar";
import { Sidebar } from "./Sidebar";
import { TopUtilityBar } from "./TopUtilityBar";
import { StatusBar } from "./StatusBar";
import { CommandPalette } from "./CommandPalette";
import { ErrorBoundary } from "./ErrorBoundary";
import { Outlet } from "react-router-dom";

export function AppShell() {
  const { isSidebarCollapsed, toggleSidebar, zenMode } = useShellStore();

  // Initialize global desktop keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans select-none antialiased">
      {/* 01. Custom Native Windows Titlebar */}
      <Titlebar />

      {/* 02. Body Region (Sidebar + Main Workspace) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar (hidden in Zen Mode) */}
        {!zenMode && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        )}

        {/* 03. Main Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          {/* Top Utility Bar (Breadcrumbs & Toggles) */}
          {!zenMode && <TopUtilityBar />}

          {/* Central Stage Canvas */}
          <main className="flex-1 overflow-y-auto px-6 py-6 focus:outline-hidden">
            <div className="max-w-[1200px] mx-auto w-full">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>

          {/* Bottom Persistent Status Bar */}
          {!zenMode && <StatusBar />}
        </div>
      </div>

      {/* 04. Command Palette Overlay (Ctrl+K) */}
      <CommandPalette />
    </div>
  );
}

export default AppShell;
