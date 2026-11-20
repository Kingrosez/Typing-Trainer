import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeakKeyHeroBanner } from "../components/WeakKeyHeroBanner";
import type { WeakKeyDto } from "@/services/api/dashboardTypes";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("WeakKeyHeroBanner (W-06)", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  const mockWeakKeys: WeakKeyDto[] = [
    {
      keyChar: "r",
      errorRate: 0.12,
      accuracy: 88.0,
      opportunities: 45,
      errors: 5,
      wpi: 0.45,
      tier: "HIGH_PRIORITY",
      explanation: "Key 'r' has an error rate of 12.0%",
    },
    {
      keyChar: "t",
      errorRate: 0.10,
      accuracy: 90.0,
      opportunities: 60,
      errors: 6,
      wpi: 0.41,
      tier: "MEDIUM_PRIORITY",
      explanation: "Key 't' has an error rate of 10.0%",
    },
  ];

  it("renders Insufficient Telemetry state when completedSessionCount is 0 without implying mastery", () => {
    render(<WeakKeyHeroBanner recommendations={[]} completedSessionCount={0} />);

    expect(screen.getByText("Algorithmic Weak-Key Remediation")).toBeInTheDocument();
    expect(screen.getByText("Telemetry Building")).toBeInTheDocument();
    expect(screen.getByText(/Insufficient telemetry to identify character error clusters/i)).toBeInTheDocument();
    expect(screen.queryByText(/Flawless Precision/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Start Baseline Test/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");
  });

  it("renders Flawless Precision mastery state when user has completed sessions and 0 weak keys", () => {
    render(<WeakKeyHeroBanner recommendations={[]} completedSessionCount={15} />);

    expect(screen.getByText("Flawless Precision 🌟")).toBeInTheDocument();
    expect(screen.getByText("Mastery (≤ 3% Error Rate)")).toBeInTheDocument();
    expect(screen.getByText(/No significant weak keys detected across your recent sessions!/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Speed Sprint Attack/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");
  });

  it("renders weak key badges and navigates to Skill Drills with pre-seeded query parameter", () => {
    render(<WeakKeyHeroBanner recommendations={mockWeakKeys} completedSessionCount={15} />);

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
});
