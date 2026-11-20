import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WpmTrendChart } from "../components/WpmTrendChart";
import type { WpmTrendPointDto } from "@/services/api/dashboardTypes";

describe("WpmTrendChart (W-05)", () => {
  const mockTrendPoints: WpmTrendPointDto[] = [
    {
      sessionId: "s-1",
      netWpm: 45.0,
      grossWpm: 50.0,
      accuracy: 90.0,
      totalErrors: 5, // Spike (> 4)
      completedAt: "2026-11-15T10:00:00Z",
    },
    {
      sessionId: "s-2",
      netWpm: 52.0,
      grossWpm: 55.0,
      accuracy: 94.5,
      totalErrors: 3,
      completedAt: "2026-11-16T12:00:00Z",
    },
    {
      sessionId: "s-3",
      netWpm: 60.0,
      grossWpm: 62.0,
      accuracy: 96.8,
      totalErrors: 2,
      completedAt: "2026-11-17T15:00:00Z",
    },
  ];

  it("renders empty state when session count is 0", () => {
    render(<WpmTrendChart wpmTrend={[]} />);

    expect(screen.getByText("Speed & Consistency Trend")).toBeInTheDocument();
    expect(screen.getByText("No sessions recorded yet")).toBeInTheDocument();
    expect(screen.getByText(/Start your first practice session to build your speed/i)).toBeInTheDocument();
  });

  it("renders educational insufficient data state when only 1 session exists", () => {
    render(<WpmTrendChart wpmTrend={[mockTrendPoints[0]!]} />);

    expect(screen.getByText("Speed & Consistency Trend")).toBeInTheDocument();
    expect(screen.getByText("1 session recorded")).toBeInTheDocument();
    expect(screen.getByText(/Complete at least 2 sessions to unlock speed and consistency trend visualization/i)).toBeInTheDocument();
  });

  it("renders multi-session trend curve and accessible table fallback", () => {
    render(<WpmTrendChart wpmTrend={mockTrendPoints} />);

    expect(screen.getByText("Speed & Consistency Trend")).toBeInTheDocument();
    expect(screen.getByText(/Net WPM progression across last 3 sessions/i)).toBeInTheDocument();

    // Check accessible table
    const table = screen.getByRole("table", { hidden: true });
    expect(table).toBeInTheDocument();
    const rows = screen.getAllByRole("row", { hidden: true });
    expect(rows.length).toBe(4); // 1 header + 3 sessions
  });

  it("shows interactive session details on hover", () => {
    render(<WpmTrendChart wpmTrend={mockTrendPoints} />);

    // Hover over session 1 (has 5 errors, > 4)
    const session1Text = screen.getByText("#1");
    fireEvent.mouseEnter(session1Text);

    expect(screen.getByText("45 Net WPM")).toBeInTheDocument();
    expect(screen.getByText("(Raw: 50 WPM)")).toBeInTheDocument();
    expect(screen.getByText("90.0% Acc")).toBeInTheDocument();
    expect(screen.getByText("5 Errors")).toBeInTheDocument();
  });

  it("matches accessible table data with chronological sessions and error counts", () => {
    render(<WpmTrendChart wpmTrend={mockTrendPoints} />);
    const rows = screen.getAllByRole("row", { hidden: true });
    // Row 1 (Session 1): Net 45 WPM, Acc 90%, 5 errors
    expect(rows[1]).toHaveTextContent("1");
    expect(rows[1]).toHaveTextContent("45");
    expect(rows[1]).toHaveTextContent("90.0%");
    expect(rows[1]).toHaveTextContent("5");

    // Row 3 (Session 3): Net 60 WPM, Acc 96.8%, 2 errors
    expect(rows[3]).toHaveTextContent("3");
    expect(rows[3]).toHaveTextContent("60");
    expect(rows[3]).toHaveTextContent("96.8%");
    expect(rows[3]).toHaveTextContent("2");
  });
});
