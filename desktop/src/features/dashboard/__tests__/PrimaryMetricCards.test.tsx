import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimaryMetricCards } from "../components/PrimaryMetricCards";
import type { PrimaryMetricsDto } from "@/services/api/dashboardTypes";

describe("PrimaryMetricCards (W-03)", () => {
  const mockPopulatedMetrics: PrimaryMetricsDto = {
    bestWpm: 72.4,
    averageWpm: 58.3,
    accuracy: 96.8,
    totalPracticeSeconds: 3720, // 1h 2m
    completedSessionCount: 15,
    currentSessionWpm: 65.0,
  };

  const mockNullMetrics: PrimaryMetricsDto = {
    bestWpm: null,
    averageWpm: null,
    accuracy: null,
    totalPracticeSeconds: 0,
    completedSessionCount: 0,
    currentSessionWpm: null,
  };

  it("renders populated metrics with correct formatting and badges", () => {
    render(<PrimaryMetricCards metrics={mockPopulatedMetrics} />);

    // Best WPM
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("60s PB")).toBeInTheDocument();
    expect(screen.getByText(/Official 60s test/i)).toBeInTheDocument();

    // Average WPM
    expect(screen.getByText("58.3")).toBeInTheDocument();
    expect(screen.getByText("Trailing Mean")).toBeInTheDocument();

    // Accuracy
    expect(screen.getByText("96.8%")).toBeInTheDocument();
    expect(screen.getByText("Target Met")).toBeInTheDocument();

    // Practice Time
    expect(screen.getByText("1h 2m")).toBeInTheDocument();
    expect(screen.getByText("15 Sessions")).toBeInTheDocument();
  });

  it("strictly preserves nullability when user has no performance history", () => {
    render(<PrimaryMetricCards metrics={mockNullMetrics} />);

    // Check that em-dashes are rendered instead of 0 or fake values
    const emDashes = screen.getAllByText("—");
    expect(emDashes.length).toBe(3); // Best WPM, Average WPM, Accuracy

    expect(screen.getByText("No 60s benchmark recorded yet")).toBeInTheDocument();
    expect(screen.getByText("No sessions recorded yet")).toBeInTheDocument();
    expect(screen.getByText("Target: ≥ 95% Precision")).toBeInTheDocument();
    expect(screen.getByText("0m")).toBeInTheDocument();
    expect(screen.getByText("0 Sessions")).toBeInTheDocument();
  });
});
