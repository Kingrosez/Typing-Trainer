import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuickPracticeCards } from "../components/QuickPracticeCards";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("QuickPracticeCards (W-07)", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renders all five practice arena action cards with shortcuts", () => {
    render(<QuickPracticeCards />);

    expect(screen.getByText("Typing Test Arena")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+2")).toBeInTheDocument();

    expect(screen.getByText("Learning Mode")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+3")).toBeInTheDocument();

    expect(screen.getByText("Skill Drills")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+4")).toBeInTheDocument();

    expect(screen.getByText("Developer Mode")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+5")).toBeInTheDocument();

    expect(screen.getByText("Typing Games")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+6")).toBeInTheDocument();
  });

  it("navigates on card click", () => {
    render(<QuickPracticeCards />);

    fireEvent.click(screen.getByRole("button", { name: /Typing Test Arena/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");

    fireEvent.click(screen.getByRole("button", { name: /Learning Mode/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/learning-mode");

    fireEvent.click(screen.getByRole("button", { name: /Skill Drills/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/skill-drills");

    fireEvent.click(screen.getByRole("button", { name: /Developer Mode/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/developer-mode");

    fireEvent.click(screen.getByRole("button", { name: /Typing Games/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-games");
  });
});
