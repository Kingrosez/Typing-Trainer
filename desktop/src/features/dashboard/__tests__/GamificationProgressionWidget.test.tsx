import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GamificationProgressionWidget } from "../components/GamificationProgressionWidget";
import type { UserStatusDto, DailyGoalDto } from "@/services/api/dashboardTypes";

describe("GamificationProgressionWidget (W-08)", () => {
  const baseDailyGoal: DailyGoalDto = {
    targetMinutes: 20,
    completedSecondsToday: 600,
    remainingSecondsToday: 600,
    progressPercentage: 50.0,
    isCompletedToday: false,
  };

  it("renders Level 1 zero XP new-user state with initial educational milestone", () => {
    const newUserStatus: UserStatusDto = {
      displayName: "NewTypist",
      currentLevel: 1,
      currentTier: "Novice",
      totalXp: 0,
      xpProgressInLevel: 0,
      xpRequiredForNextLevel: 120,
      levelProgressPercentage: 0.0,
      currentStreakDays: 0,
      longestStreakDays: 0,
      freezeShieldsAvailable: 0,
    };

    render(
      <GamificationProgressionWidget
        userStatus={newUserStatus}
        dailyGoal={baseDailyGoal}
      />
    );

    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Novice")).toBeInTheDocument();
    expect(screen.getByText("Total: 0 XP")).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 120 XP \(0\.0%\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Complete your first practice session to earn Base Effort XP & begin leveling/i)
    ).toBeInTheDocument();
    expect(screen.getByText("0 Days Streak")).toBeInTheDocument();
    expect(screen.getByText("0 / 2")).toBeInTheDocument();
  });

  it("renders populated XP progress, tier, and remaining XP to next level", () => {
    const populatedStatus: UserStatusDto = {
      displayName: "Alex",
      currentLevel: 12,
      currentTier: "Apprentice",
      totalXp: 2450,
      xpProgressInLevel: 450,
      xpRequiredForNextLevel: 600,
      levelProgressPercentage: 75.0,
      currentStreakDays: 5,
      longestStreakDays: 14,
      freezeShieldsAvailable: 1,
    };

    render(
      <GamificationProgressionWidget
        userStatus={populatedStatus}
        dailyGoal={baseDailyGoal}
      />
    );

    expect(screen.getByText("Level 12")).toBeInTheDocument();
    expect(screen.getByText("Apprentice")).toBeInTheDocument();
    expect(screen.getByText("Total: 2,450 XP")).toBeInTheDocument();
    expect(screen.getByText(/450 \/ 600 XP \(75\.0%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/150 XP remaining to unlock next tier rewards/i)).toBeInTheDocument();
    expect(screen.getByText("5 Days Streak")).toBeInTheDocument();
    expect(screen.getByText("(Best: 14d)")).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("handles maximum progress and clamps progress bar to 100%", () => {
    const maxStatus: UserStatusDto = {
      displayName: "Alex",
      currentLevel: 20,
      currentTier: "Journeyman",
      totalXp: 10000,
      xpProgressInLevel: 800,
      xpRequiredForNextLevel: 800,
      levelProgressPercentage: 100.0,
      currentStreakDays: 21,
      longestStreakDays: 21,
      freezeShieldsAvailable: 2,
    };

    render(
      <GamificationProgressionWidget
        userStatus={maxStatus}
        dailyGoal={baseDailyGoal}
      />
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText(/800 \/ 800 XP \(100\.0%\)/i)).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("safely handles zero denominator without crashing or NaN", () => {
    const zeroDenominatorStatus: UserStatusDto = {
      displayName: "Alex",
      currentLevel: 1,
      currentTier: "Novice",
      totalXp: 0,
      xpProgressInLevel: 0,
      xpRequiredForNextLevel: 0,
      levelProgressPercentage: 0.0,
      currentStreakDays: 0,
      longestStreakDays: 0,
      freezeShieldsAvailable: 0,
    };

    render(
      <GamificationProgressionWidget
        userStatus={zeroDenominatorStatus}
        dailyGoal={baseDailyGoal}
      />
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText(/0 \/ 0 XP \(0\.0%\)/i)).toBeInTheDocument();
  });

  it("renders daily goal completed status (+150 XP bonus credited)", () => {
    const completedDailyGoal: DailyGoalDto = {
      targetMinutes: 20,
      completedSecondsToday: 1500,
      remainingSecondsToday: 0,
      progressPercentage: 100.0,
      isCompletedToday: true,
    };

    const status: UserStatusDto = {
      displayName: "Alex",
      currentLevel: 5,
      currentTier: "Novice",
      totalXp: 1200,
      xpProgressInLevel: 200,
      xpRequiredForNextLevel: 400,
      levelProgressPercentage: 50.0,
      currentStreakDays: 7,
      longestStreakDays: 7,
      freezeShieldsAvailable: 1,
    };

    render(
      <GamificationProgressionWidget
        userStatus={status}
        dailyGoal={completedDailyGoal}
      />
    );

    expect(screen.getByText("Goal Met (+150 XP)")).toBeInTheDocument();
  });

  it("renders daily goal in progress when not completed today", () => {
    const inProgressGoal: DailyGoalDto = {
      targetMinutes: 20,
      completedSecondsToday: 300,
      remainingSecondsToday: 900,
      progressPercentage: 25.0,
      isCompletedToday: false,
    };

    const status: UserStatusDto = {
      displayName: "Alex",
      currentLevel: 5,
      currentTier: "Novice",
      totalXp: 1200,
      xpProgressInLevel: 200,
      xpRequiredForNextLevel: 400,
      levelProgressPercentage: 50.0,
      currentStreakDays: 3,
      longestStreakDays: 7,
      freezeShieldsAvailable: 0,
    };

    render(
      <GamificationProgressionWidget
        userStatus={status}
        dailyGoal={inProgressGoal}
      />
    );

    expect(screen.getByText("Goal: 25%")).toBeInTheDocument();
  });

  it("renders loading skeleton state when isLoading is true", () => {
    const status: UserStatusDto = {
      displayName: "Alex",
      currentLevel: 5,
      currentTier: "Novice",
      totalXp: 1200,
      xpProgressInLevel: 200,
      xpRequiredForNextLevel: 400,
      currentStreakDays: 3,
      longestStreakDays: 7,
      freezeShieldsAvailable: 0,
    };

    render(
      <GamificationProgressionWidget
        userStatus={status}
        dailyGoal={baseDailyGoal}
        isLoading={true}
      />
    );

    expect(screen.getByLabelText("Loading Gamification Progression")).toBeInTheDocument();
  });
});
