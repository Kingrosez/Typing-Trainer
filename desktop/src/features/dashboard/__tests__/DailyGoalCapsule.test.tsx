import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DailyGoalCapsule } from "../components/DailyGoalCapsule";
import type { DailyGoalDto } from "@/services/api/dashboardTypes";

describe("DailyGoalCapsule (W-02)", () => {
  const mockIncompleteGoal: DailyGoalDto = {
    targetMinutes: 20,
    completedSecondsToday: 720, // 12 mins
    remainingSecondsToday: 480, // 8 mins
    progressPercentage: 60.0,
    isCompletedToday: false,
  };

  const mockCompletedGoal: DailyGoalDto = {
    targetMinutes: 20,
    completedSecondsToday: 1320, // 22 mins
    remainingSecondsToday: 0,
    progressPercentage: 100.0,
    isCompletedToday: true,
  };

  it("renders incomplete goal with progress percentage and remaining minutes", () => {
    const handleUpdate = vi.fn().mockResolvedValue(undefined);
    render(<DailyGoalCapsule dailyGoal={mockIncompleteGoal} onUpdateGoal={handleUpdate} />);

    expect(screen.getByText("12 / 20 mins")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText(/8 mins remaining to seal streak/i)).toBeInTheDocument();
    expect(screen.queryByText(/Goal Completed/i)).not.toBeInTheDocument();
  });

  it("renders completed goal with emerald checkmark and +150 XP bonus copy", () => {
    const handleUpdate = vi.fn().mockResolvedValue(undefined);
    render(<DailyGoalCapsule dailyGoal={mockCompletedGoal} onUpdateGoal={handleUpdate} />);

    expect(screen.getByText("22 / 20 mins")).toBeInTheDocument();
    expect(screen.getByText("Met")).toBeInTheDocument();
    expect(screen.getByText(/Goal Completed! \+150 XP Daily Bonus Awarded\./i)).toBeInTheDocument();
  });

  it("opens edit modal, validates target minutes, and calls onUpdateGoal", async () => {
    const handleUpdate = vi.fn().mockResolvedValue(undefined);
    render(<DailyGoalCapsule dailyGoal={mockIncompleteGoal} onUpdateGoal={handleUpdate} />);

    // Click edit button
    const editBtn = screen.getByRole("button", { name: /Edit daily practice goal/i });
    fireEvent.click(editBtn);

    // Modal is open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Set Daily Practice Goal")).toBeInTheDocument();

    const input = screen.getByLabelText(/Target Minutes per Day/i) as HTMLInputElement;
    expect(input.value).toBe("20");

    // Click a preset button (30 mins)
    const preset30Btn = screen.getByRole("button", { name: "30 mins" });
    fireEvent.click(preset30Btn);
    expect(input.value).toBe("30");

    // Click save
    const saveBtn = screen.getByRole("button", { name: /Save Goal/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledWith(30);
    });
  });

  it("validates input boundary conditions (1 to 120 mins)", async () => {
    const handleUpdate = vi.fn().mockResolvedValue(undefined);
    render(<DailyGoalCapsule dailyGoal={mockIncompleteGoal} onUpdateGoal={handleUpdate} />);

    fireEvent.click(screen.getByRole("button", { name: /Edit daily practice goal/i }));

    const input = screen.getByLabelText(/Target Minutes per Day/i);
    // Invalid: 0 mins
    fireEvent.change(input, { target: { value: "0" } });
    expect(screen.getByText("Daily goal must be at least 1 minute")).toBeInTheDocument();

    // Invalid: 150 mins
    fireEvent.change(input, { target: { value: "150" } });
    expect(screen.getByText("Daily goal cannot exceed 120 minutes")).toBeInTheDocument();

    // Save button should be disabled
    expect(screen.getByRole("button", { name: /Save Goal/i })).toBeDisabled();
  });
});
