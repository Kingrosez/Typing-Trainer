import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WelcomeStatusHeader } from "../components/WelcomeStatusHeader";
import type { UserStatusDto } from "@/services/api/dashboardTypes";

describe("WelcomeStatusHeader (W-01)", () => {
  const mockReturningUser: UserStatusDto = {
    displayName: "Alex",
    currentLevel: 12,
    currentTier: "Apprentice",
    totalXp: 2450,
    xpProgressInLevel: 450,
    xpRequiredForNextLevel: 1000,
    currentStreakDays: 5,
    longestStreakDays: 14,
    freezeShieldsAvailable: 2,
  };

  const mockNewUser: UserStatusDto = {
    displayName: "NewTypist",
    currentLevel: 1,
    currentTier: "Novice",
    totalXp: 0,
    xpProgressInLevel: 0,
    xpRequiredForNextLevel: 120,
    currentStreakDays: 0,
    longestStreakDays: 0,
    freezeShieldsAvailable: 0,
  };

  it("renders returning user greeting with streak and tier rank pill", () => {
    render(
      <WelcomeStatusHeader
        userStatus={mockReturningUser}
        completedSessionCount={25}
      />
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome back, Alex! 👋");
    expect(screen.getByText("Level 12 • Apprentice")).toBeInTheDocument();
    expect(screen.getByText("5d streak")).toBeInTheDocument();
    expect(screen.getByText(/5-day practice streak/i)).toBeInTheDocument();
  });

  it("renders educational zero state greeting for new user with 0 completed sessions", () => {
    render(
      <WelcomeStatusHeader
        userStatus={mockNewUser}
        completedSessionCount={0}
      />
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to Typing Trainer, NewTypist! ⌨");
    expect(screen.getByText("Level 1 • Novice")).toBeInTheDocument();
    expect(screen.queryByText(/streak/i)).not.toBeInTheDocument();
    expect(screen.getByText(/An offline desktop application engineered to build touch-typing speed/i)).toBeInTheDocument();
  });

  it("renders returning user with zero streak encouraging session completion", () => {
    const zeroStreakUser = { ...mockReturningUser, currentStreakDays: 0 };
    render(
      <WelcomeStatusHeader
        userStatus={zeroStreakUser}
        completedSessionCount={10}
      />
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome back, Alex! 👋");
    expect(screen.getByText(/Complete a practice session to start your daily streak/i)).toBeInTheDocument();
  });
});
