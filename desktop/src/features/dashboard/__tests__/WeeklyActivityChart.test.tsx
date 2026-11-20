import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeeklyActivityChart } from "../components/WeeklyActivityChart";
import type { WeeklyActivityDayDto } from "@/services/api/dashboardTypes";

describe("WeeklyActivityChart (W-04)", () => {
  const mock7Days: WeeklyActivityDayDto[] = [
    { dayOfWeek: "Mon", date: "2026-11-16", durationSeconds: 1200, goalMet: true, isToday: false },
    { dayOfWeek: "Tue", date: "2026-11-17", durationSeconds: 1500, goalMet: true, isToday: false },
    { dayOfWeek: "Wed", date: "2026-11-18", durationSeconds: 600, goalMet: false, isToday: false },
    { dayOfWeek: "Thu", date: "2026-11-19", durationSeconds: 1800, goalMet: true, isToday: false },
    { dayOfWeek: "Fri", date: "2026-11-20", durationSeconds: 720, goalMet: false, isToday: true },
    { dayOfWeek: "Sat", date: "2026-11-21", durationSeconds: 0, goalMet: false, isToday: false },
    { dayOfWeek: "Sun", date: "2026-11-22", durationSeconds: 0, goalMet: false, isToday: false },
  ];

  it("renders 7 day vertical columns with goal met badges and minutes", () => {
    render(<WeeklyActivityChart weeklyActivity={mock7Days} targetMinutes={20} />);

    expect(screen.getByText("Weekly Practice Activity")).toBeInTheDocument();
    expect(screen.getByText("Goal Met (3/7)")).toBeInTheDocument();
    expect(screen.getByText("Target (20m)")).toBeInTheDocument();

    // Days Mon..Sun are present
    expect(screen.getAllByText("Mon").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Tue").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Wed").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Thu").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Fri").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sat").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sun").length).toBeGreaterThanOrEqual(1);

    // Check minutes labels
    expect(screen.getAllByText("20m").length).toBeGreaterThanOrEqual(1); // Mon (1200s) / Target
    expect(screen.getByText("25m")).toBeInTheDocument(); // Tue (1500s)
    expect(screen.getByText("10m")).toBeInTheDocument(); // Wed (600s)
    expect(screen.getByText("30m")).toBeInTheDocument(); // Thu (1800s)
    expect(screen.getByText("12m")).toBeInTheDocument(); // Fri (720s)
  });

  it("provides an accessible hidden table fallback for screen readers", () => {
    render(<WeeklyActivityChart weeklyActivity={mock7Days} targetMinutes={20} />);

    const table = screen.getByRole("table", { hidden: true });
    expect(table).toBeInTheDocument();
    expect(screen.getByText("7-Day Weekly Practice Activity and Goal Completion")).toBeInTheDocument();

    // Check rows in accessible table
    const rows = screen.getAllByRole("row", { hidden: true });
    expect(rows.length).toBe(8); // 1 header + 7 days
  });

  it("handles empty activity array gracefully", () => {
    render(<WeeklyActivityChart weeklyActivity={[]} targetMinutes={20} />);

    expect(screen.getByText("Weekly Practice Activity")).toBeInTheDocument();
    expect(screen.getByText("Goal Met (0/7)")).toBeInTheDocument();
  });
});
