import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../Dashboard";
import { dashboardService } from "@/services/api/dashboardService";
import type { DashboardSummaryResponse } from "@/services/api/dashboardTypes";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/services/api/dashboardService", () => ({
  dashboardService: {
    getDashboardSummary: vi.fn(),
    updateDailyGoal: vi.fn(),
  },
}));

describe("Dashboard Page (Stage 2.2 Integration)", () => {
  const mockSummary: DashboardSummaryResponse = {
    userStatus: {
      displayName: "Alex",
      currentLevel: 5,
      currentTier: "Novice Touch Typist",
      totalXp: 1200,
      xpProgressInLevel: 200,
      xpRequiredForNextLevel: 500,
      currentStreakDays: 3,
      longestStreakDays: 7,
      freezeShieldsAvailable: 1,
    },
    dailyGoal: {
      targetMinutes: 20,
      completedSecondsToday: 900, // 15 mins
      remainingSecondsToday: 300, // 5 mins
      progressPercentage: 75.0,
      isCompletedToday: false,
    },
    primaryMetrics: {
      bestWpm: 68.0,
      averageWpm: 55.4,
      accuracy: 97.2,
      totalPracticeSeconds: 4500,
      completedSessionCount: 12,
      currentSessionWpm: 60.0,
    },
    weeklyActivity: [],
    wpmTrend: [],
    weakKeyRecommendations: [],
    personalBests: {
      best15sWpm: null,
      best60sWpm: 68.0,
      bestDevModeWpm: null,
      longestSessionSeconds: null,
    },
    recentSessions: [],
    weakKeyOverview: {
      overallStatus: "NO_RECOMMENDATIONS",
      headline: "Optimal Performance",
      explanation: "No weak keys detected across your recent sessions.",
      weakKeyCount: 0,
      developingKeyCount: 0,
      stableKeyCount: 0,
      masteredKeyCount: 0,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton initially, then renders live integrated widgets", async () => {
    vi.mocked(dashboardService.getDashboardSummary).mockResolvedValueOnce(mockSummary);

    render(<Dashboard />);

    // Skeleton is displayed initially
    expect(screen.getByLabelText(/Loading dashboard\.\.\./i)).toBeInTheDocument();

    // Resolves and displays live widgets
    await waitFor(() => {
      expect(screen.getByText("Welcome back, Alex! 👋")).toBeInTheDocument();
    });

    // W-01: Welcome & Status
    expect(screen.getByText("Level 5 • Novice Touch Typist")).toBeInTheDocument();
    expect(screen.getByText("3d streak")).toBeInTheDocument();

    // W-02: Daily Goal
    expect(screen.getByText("15 / 20 mins")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();

    // W-03: Metrics
    expect(screen.getByText("68")).toBeInTheDocument();
    expect(screen.getByText("55.4")).toBeInTheDocument();
    expect(screen.getByText("97.2%")).toBeInTheDocument();

    // W-04: Weekly Activity Chart
    expect(screen.getByText("Weekly Practice Activity")).toBeInTheDocument();

    // W-05: WPM Trend Chart
    expect(screen.getByText("Speed & Consistency Trend")).toBeInTheDocument();

    // W-06: Weak-Key Remediation Banner (Reconciled D6 status)
    expect(screen.getByText(/Optimal Performance/i)).toBeInTheDocument();
    expect(screen.getAllByText(/No Weak Keys Detected/i).length).toBeGreaterThanOrEqual(1);

    // W-07: Arenas
    expect(screen.getByText("Typing Test Arena")).toBeInTheDocument();
    expect(screen.getByText("Learning Mode")).toBeInTheDocument();
    expect(screen.getByText("Skill Drills")).toBeInTheDocument();
    expect(screen.getByText("Developer Mode")).toBeInTheDocument();
    expect(screen.getByText("Typing Games")).toBeInTheDocument();
  });

  it("handles backend error gracefully and provides a retry connection button", async () => {
    vi.mocked(dashboardService.getDashboardSummary).mockRejectedValueOnce(
      new Error("Network connection refused")
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText(/Local backend is currently offline or synchronizing/i)).toBeInTheDocument();
    });

    // Offline fallback data is populated safely
    expect(screen.getByText(/Welcome to Typing Trainer, Typist! ⌨/i)).toBeInTheDocument();
    expect(screen.getByText("Retry Connection")).toBeInTheDocument();

    // Retrying calls service again
    vi.mocked(dashboardService.getDashboardSummary).mockResolvedValueOnce(mockSummary);
    fireEvent.click(screen.getByText("Retry Connection"));

    await waitFor(() => {
      expect(screen.getByText("Welcome back, Alex! 👋")).toBeInTheDocument();
    });
  });

  it("allows updating daily goal and updates state reactively", async () => {
    vi.mocked(dashboardService.getDashboardSummary).mockResolvedValueOnce(mockSummary);
    vi.mocked(dashboardService.updateDailyGoal).mockResolvedValueOnce({
      targetMinutes: 25,
      completedSecondsToday: 900,
      remainingSecondsToday: 600,
      progressPercentage: 60.0,
      isCompletedToday: false,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Welcome back, Alex! 👋")).toBeInTheDocument();
    });

    // Open goal modal
    fireEvent.click(screen.getByRole("button", { name: /Edit daily practice goal/i }));

    // Choose 25 mins or enter in input
    const input = screen.getByLabelText(/Target Minutes per Day/i);
    fireEvent.change(input, { target: { value: "25" } });

    fireEvent.click(screen.getByRole("button", { name: /Save Goal/i }));

    await waitFor(() => {
      expect(dashboardService.updateDailyGoal).toHaveBeenCalledWith({ targetMinutes: 25 });
      expect(screen.getByText("15 / 25 mins")).toBeInTheDocument();
    });
  });
});
