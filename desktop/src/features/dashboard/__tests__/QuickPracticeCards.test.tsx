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

  it("handles Ctrl+2 through Ctrl+6 keyboard accelerators", () => {
    render(<QuickPracticeCards />);

    // Ctrl+2 -> /typing-test
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "2", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-test");

    // Ctrl+3 -> /learning-mode
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "3", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/learning-mode");

    // Ctrl+4 -> /skill-drills
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "4", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/skill-drills");

    // Ctrl+5 -> /developer-mode
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "5", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/developer-mode");

    // Ctrl+6 -> /typing-games
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "6", ctrlKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith("/typing-games");
  });
});
