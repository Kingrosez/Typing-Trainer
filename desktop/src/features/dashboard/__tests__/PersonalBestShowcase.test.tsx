import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PersonalBestShowcase } from "../components/PersonalBestShowcase";
import type { PersonalBestsDto } from "@/services/api/dashboardTypes";

describe("PersonalBestShowcase (W-09)", () => {
  it("renders all four personal best records with winning metadata", () => {
    const populatedPbs: PersonalBestsDto = {
      best15sWpm: 84.2,
      best60sWpm: 72.4,
      bestDevModeWpm: 58.1,
      longestSessionSeconds: 2535.0, // 42m 15s
      best15sAccuracy: 99.1,
      best60sAccuracy: 98.4,
      bestDevModeAccuracy: 97.2,
      longestSessionAccuracy: 96.0,
      best15sDate: "2026-11-18T14:30:00Z",
      best60sDate: "2026-11-19T16:00:00Z",
      bestDevModeDate: "2026-11-20T11:15:00Z",
      longestSessionDate: "2026-11-17T09:00:00Z",
    };

    render(<PersonalBestShowcase personalBests={populatedPbs} />);

    expect(screen.getByText("Personal Best Showcase")).toBeInTheDocument();

    // 15s Sprint
    expect(screen.getByText("15s Sprint")).toBeInTheDocument();
    expect(screen.getByText("84 WPM")).toBeInTheDocument();
    expect(screen.getByText("99.1% Acc")).toBeInTheDocument();

    // 60s Official Benchmark (distinguished)
    expect(screen.getByText("60s Benchmark")).toBeInTheDocument();
    expect(screen.getByText("72 WPM")).toBeInTheDocument();
    expect(screen.getByText("98.4% Acc")).toBeInTheDocument();
    expect(screen.getByText("Official")).toBeInTheDocument();

    // Dev Studio
    expect(screen.getByText("Dev Studio")).toBeInTheDocument();
    expect(screen.getByText("58 WPM")).toBeInTheDocument();
    expect(screen.getByText("97.2% Acc")).toBeInTheDocument();

    // Longest Session
    expect(screen.getByText("Longest Session")).toBeInTheDocument();
    expect(screen.getByText("42m 15s")).toBeInTheDocument();
    expect(screen.getByText("96.0% Acc")).toBeInTheDocument();
  });

  it("renders clean educational empty state when all records are null without fabricating zero", () => {
    const emptyPbs: PersonalBestsDto = {
      best15sWpm: null,
      best60sWpm: null,
      bestDevModeWpm: null,
      longestSessionSeconds: null,
    };

    render(<PersonalBestShowcase personalBests={emptyPbs} />);

    expect(screen.getByText("No Verified Benchmarks Yet")).toBeInTheDocument();
    expect(
      screen.getByText(/Complete a 15s speed sprint, 60s test, or code drill with ≥95% accuracy/i)
    ).toBeInTheDocument();

    // Ensure "0 WPM" is NOT displayed
    expect(screen.queryByText("0 WPM")).not.toBeInTheDocument();
  });

  it("renders partially populated records with unrecorded placeholders for missing records", () => {
    const partialPbs: PersonalBestsDto = {
      best15sWpm: 92.0,
      best60sWpm: null,
      bestDevModeWpm: null,
      longestSessionSeconds: 60.0,
      best15sAccuracy: 98.0,
      best60sAccuracy: null,
      bestDevModeAccuracy: null,
      longestSessionAccuracy: 95.5,
      best15sDate: "2026-11-20T10:00:00Z",
      best60sDate: null,
      bestDevModeDate: null,
      longestSessionDate: "2026-11-19T10:00:00Z",
    };

    render(<PersonalBestShowcase personalBests={partialPbs} />);

    // 15s Sprint present
    expect(screen.getByText("92 WPM")).toBeInTheDocument();
    expect(screen.getByText("98.0% Acc")).toBeInTheDocument();

    // Longest session present
    expect(screen.getByText("1m")).toBeInTheDocument();
    expect(screen.getByText("95.5% Acc")).toBeInTheDocument();

    // 60s benchmark and dev mode unrecorded placeholders
    const placeholders = screen.getAllByText("— WPM");
    expect(placeholders).toHaveLength(2);
  });

  it("safely handles null accuracy and dates without crashing", () => {
    const nullMetadataPbs: PersonalBestsDto = {
      best15sWpm: 80.0,
      best60sWpm: 70.0,
      bestDevModeWpm: null,
      longestSessionSeconds: null,
      best15sAccuracy: null,
      best60sAccuracy: null,
      best15sDate: null,
      best60sDate: null,
    };

    render(<PersonalBestShowcase personalBests={nullMetadataPbs} />);

    expect(screen.getByText("80 WPM")).toBeInTheDocument();
    expect(screen.getByText("70 WPM")).toBeInTheDocument();
    expect(screen.getByText("≥95% required")).toBeInTheDocument();
    expect(screen.getByText("Standard corpus")).toBeInTheDocument();
  });

  it("renders loading skeleton state when isLoading is true", () => {
    render(
      <PersonalBestShowcase
        personalBests={{
          best15sWpm: null,
          best60sWpm: null,
          bestDevModeWpm: null,
          longestSessionSeconds: null,
        }}
        isLoading={true}
      />
    );

    expect(screen.getByLabelText("Loading Personal Bests")).toBeInTheDocument();
  });
});
