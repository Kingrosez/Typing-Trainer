import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppShell } from "../AppShell";
import { ThemeProvider } from "../../../app/providers/ThemeProvider";

// Mock Tauri window API
vi.mock("../../../lib/window", () => ({
  isTauriEnvironment: () => false,
  minimizeWindow: vi.fn(),
  toggleMaximizeWindow: vi.fn(),
  closeWindow: vi.fn(),
  isWindowMaximized: vi.fn().mockResolvedValue(false),
}));

describe("Desktop AppShell Component (Phase 1)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderShell = (initialRoute = "/") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it("renders the custom Titlebar with branding and controls", () => {
    renderShell();

    // Verify Titlebar branding
    expect(screen.getByText("Typing Trainer")).toBeInTheDocument();
    expect(screen.getByText("Offline-Ready")).toBeInTheDocument();

    // Verify window controls
    expect(screen.getByRole("button", { name: /minimize/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /maximize/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("renders the Sidebar navigation with all approved D1 sections", () => {
    renderShell();

    const sidebarNav = screen.getByRole("navigation", { name: /main navigation/i });

    // Navigation sections in Sidebar
    expect(sidebarNav).toHaveTextContent("Overview");
    expect(sidebarNav).toHaveTextContent("Practice Arenas");
    expect(sidebarNav).toHaveTextContent("Mastery");
    expect(sidebarNav).toHaveTextContent("System");

    // Primary destinations
    expect(sidebarNav).toHaveTextContent("Dashboard");
    expect(sidebarNav).toHaveTextContent("Typing Test");
    expect(sidebarNav).toHaveTextContent("Learning Mode");
    expect(sidebarNav).toHaveTextContent("Skill Drills");
    expect(sidebarNav).toHaveTextContent("Developer Mode");
    expect(sidebarNav).toHaveTextContent("Typing Games");
    expect(sidebarNav).toHaveTextContent("Analytics");
    expect(sidebarNav).toHaveTextContent("Achievements");
    expect(sidebarNav).toHaveTextContent("Settings");
  });

  it("toggles sidebar collapse state when toggle button is clicked", () => {
    renderShell();

    const collapseButton = screen.getByRole("button", { name: /collapse sidebar/i });
    expect(collapseButton).toBeInTheDocument();

    fireEvent.click(collapseButton);

    // After collapse, expand button should appear
    expect(screen.getByRole("button", { name: /expand sidebar/i })).toBeInTheDocument();
  });

  it("renders the persistent Bottom Status Bar", () => {
    renderShell();

    expect(screen.getByText("Typing Trainer Desktop Shell (Phase 1)")).toBeInTheDocument();
    expect(screen.getByText("SQLite: Ready")).toBeInTheDocument();
    expect(screen.getByText("0ms Latency")).toBeInTheDocument();
  });

  it("opens the Command Palette when the titlebar search button is clicked", () => {
    renderShell();

    const searchButton = screen.getByTitle(/open command palette/i);
    expect(searchButton).toBeInTheDocument();

    fireEvent.click(searchButton);

    // Command palette modal should be visible
    expect(screen.getByRole("dialog", { name: /command palette/i })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/type a command or search destinations/i)
    ).toBeInTheDocument();
  });
});
