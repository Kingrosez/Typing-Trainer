import { useState, useEffect } from "react";
import { Titlebar } from "./Titlebar";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { Outlet } from "react-router-dom";

export function AppShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check for saved preference or use default
  useEffect(() => {
    const savedCollapseState = localStorage.getItem("sidebarCollapsed");
    if (savedCollapseState !== null) {
      setIsSidebarCollapsed(savedCollapseState === "true");
    }
  }, []);

  // Save collapse state when it changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Titlebar */}
      <Titlebar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>

          {/* Status Bar */}
          <StatusBar />
        </div>
      </div>
    </div>
  );
}
