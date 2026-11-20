import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeakKeyHeroBanner } from "../components/WeakKeyHeroBanner";
import type { WeakKeyDto, WeakKeyOverviewDto } from "@/services/api/dashboardTypes";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("WeakKeyHeroBanner (W-06) - D6 Mastery & Classification Reconciliation", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  const mockWeakKeys: WeakKeyDto[] = [
    {
      keyChar: "r",
      errorRate: 12.0,
      accuracy: 88.0,
      opportunities: 45,
      errors: 5,
      wpi: 45.6,
      tier: "Weak",
      explanation: "Key 'r' has an error rate of 12.0%",
    },
    {
      keyChar: "t",
      errorRate: 10.0,
      accuracy: 90.0,
      opportunities: 60,
      errors: 6,
      wpi: 41.1,
      tier: "Weak",
      explanation: "Key 't' has an error rate of 10.0%",
    },
  ];

  it("1. State: INSUFFICIENT_DATA - when completedSessionCount is 0 or opportunities < 20 (never implies mastery)", () => {
    const overview: WeakKeyOverviewDto = {
      overallStatus: "INSUFFICIENT_DATA",
      headline: "Algorithmic Weak-Key Remediation",
      explanation: "Insufficient telemetry to evaluate character friction. Minimum 20 eligible opportunities required.",
      weakKeyCount: 0,
      developingKeyCount: 0,
      stableKeyCount: 0,
      masteredKeyCount: 0,
    };

    render(<WeakKeyHeroBanner recommendations={[]} completedSessionCount={0} overview={overview} />);

    expect(screen.getByText("Algorithmic Weak-Key Remediation")).toBeInTheDocument();
    expect(screen.getByText("Telemetry Building")).toBeInTheDocument();
    expect(screen.getByText(/Insufficient telemetry to evaluate character friction/i)).toBeInTheDocument();
    expect(screen.queryByText(/Flawless Precision/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Start Baseline Test/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");
  });

  it("2. State: WEAK - renders key badges and navigates to Skill Drills with pre-seeded query parameter", () => {
    const overview: WeakKeyOverviewDto = {
      overallStatus: "WEAK",
      headline: "Algorithmic Weak-Key Remediation",
      explanation: "Elevated friction detected on key reaches.",
      weakKeyCount: 2,
      developingKeyCount: 0,
      stableKeyCount: 0,
      masteredKeyCount: 0,
    };

    render(<WeakKeyHeroBanner recommendations={mockWeakKeys} completedSessionCount={15} overview={overview} />);

    expect(screen.getByText("Algorithmic Weak-Key Remediation")).toBeInTheDocument();
    expect(screen.getByText("Action Recommended")).toBeInTheDocument();

    // Key badges
    expect(screen.getByText("R")).toBeInTheDocument();
    expect(screen.getByText("88% Acc")).toBeInTheDocument();
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("90% Acc")).toBeInTheDocument();

    // Subtitle
    expect(screen.getByText(/R, T/i)).toBeInTheDocument();

    // Click CTA button
    fireEvent.click(screen.getByRole("button", { name: /Practice Weak Keys/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/skill-drills?keys=r,t");
  });

  it("3. State: DEVELOPING - renders dexterity developing badge and routes to Learning Mode", () => {
    const overview: WeakKeyOverviewDto = {
      overallStatus: "DEVELOPING",
      headline: "Dexterity Developing",
      explanation: "Moderate friction (5–8% error rate) detected.",
      weakKeyCount: 0,
      developingKeyCount: 2,
      stableKeyCount: 0,
      masteredKeyCount: 0,
    };

    render(<WeakKeyHeroBanner recommendations={[]} completedSessionCount={10} overview={overview} />);

    expect(screen.getByText("Dexterity Developing")).toBeInTheDocument();
    expect(screen.getByText("Developing (5–8% Error)")).toBeInTheDocument();
    expect(screen.queryByText(/Flawless Precision/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Refine Technique/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/learning-mode");
  });

  it("4. State: STABLE - renders accuracy stabilized (3-5% error rate) without claiming mastery", () => {
    const overview: WeakKeyOverviewDto = {
      overallStatus: "STABLE",
      headline: "Accuracy Stabilized",
      explanation: "Target keys maintain consistent accuracy (3–5% error rate).",
      weakKeyCount: 0,
      developingKeyCount: 0,
      stableKeyCount: 3,
      masteredKeyCount: 0,
    };

    render(<WeakKeyHeroBanner recommendations={[]} completedSessionCount={12} overview={overview} />);

    expect(screen.getByText("Accuracy Stabilized")).toBeInTheDocument();
    expect(screen.getByText("Stable (3–5% Error)")).toBeInTheDocument();
    expect(screen.queryByText(/Flawless Precision/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Qualify for Mastery/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/skill-drills");
  });

  it("5. State: MASTERED - renders Flawless Precision only when backend certifies 3 clean sessions", () => {
    const overview: WeakKeyOverviewDto = {
      overallStatus: "MASTERED",
      headline: "Flawless Precision 🌟",
      explanation: "Certified touch-typing mastery achieved across 3 qualifying drill sessions.",
      weakKeyCount: 0,
      developingKeyCount: 0,
      stableKeyCount: 0,
      masteredKeyCount: 4,
    };

    render(<WeakKeyHeroBanner recommendations={[]} completedSessionCount={25} overview={overview} />);

    expect(screen.getByText("Flawless Precision 🌟")).toBeInTheDocument();
    expect(screen.getByText("Certified Mastery (≤ 3% Error)")).toBeInTheDocument();
    expect(screen.getByText(/Certified touch-typing mastery achieved/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Speed Sprint Attack/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");
  });

  it("6. State: NO_RECOMMENDATIONS - active typing with no weak keys does NOT falsely claim mastery", () => {
    const overview: WeakKeyOverviewDto = {
      overallStatus: "NO_RECOMMENDATIONS",
      headline: "Optimal Performance",
      explanation: "No weak keys detected across your recent sessions.",
      weakKeyCount: 0,
      developingKeyCount: 0,
      stableKeyCount: 0,
      masteredKeyCount: 0,
    };

    render(<WeakKeyHeroBanner recommendations={[]} completedSessionCount={15} overview={overview} />);

    expect(screen.getByText("Optimal Performance")).toBeInTheDocument();
    expect(screen.getByText("No Weak Keys Detected")).toBeInTheDocument();
    // Must NOT claim Mastered or Flawless Precision!
    expect(screen.queryByText(/Flawless Precision/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Certified Mastery/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Maintain Momentum/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");
  });
});
