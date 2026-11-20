import React, { useState } from "react";
import type { DailyGoalDto } from "@/services/api/dashboardTypes";
import { Check, Edit2 } from "lucide-react";
import { DailyGoalModal } from "./DailyGoalModal";

interface DailyGoalCapsuleProps {
  dailyGoal: DailyGoalDto;
  onUpdateGoal: (targetMinutes: number) => Promise<void>;
  isLoading?: boolean;
}

export const DailyGoalCapsule: React.FC<DailyGoalCapsuleProps> = ({
  dailyGoal,
  onUpdateGoal,
  isLoading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    targetMinutes,
    completedSecondsToday,
    remainingSecondsToday,
    progressPercentage,
    isCompletedToday,
  } = dailyGoal;

  const completedMinutes = Math.floor(completedSecondsToday / 60);
  const remainingMinutes = Math.ceil(remainingSecondsToday / 60);

  // SVG circular progress calculation (Diameter 56, Radius 23, Stroke 5)
  const radius = 23;
  const circumference = 2 * Math.PI * radius; // ~144.51
  const clampedProgress = Math.min(100, Math.max(0, progressPercentage));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <>
      <div
        className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card text-card-foreground shadow-sm h-full"
        aria-label="Daily Practice Goal"
      >
        <div className="flex items-center gap-3.5">
          {/* Circular SVG Progress Ring */}
          <div
            className="relative flex items-center justify-center shrink-0 w-14 h-14"
            role="progressbar"
            aria-valuenow={Math.round(clampedProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Daily practice goal progress: ${Math.round(clampedProgress)}%`}
          >
            <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 56 56">
              {/* Background Track */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-secondary dark:text-muted/30"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke={isCompletedToday ? "#10B981" : "#2563EB"}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>

            {/* Inner Ring Indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isCompletedToday ? (
                <Check className="w-5 h-5 text-emerald-500" aria-hidden="true" />
              ) : (
                <span className="text-[11px] font-mono font-bold text-foreground tabular-nums">
                  {Math.round(clampedProgress)}%
                </span>
              )}
            </div>
          </div>

          {/* Metric Copy */}
          <div className="flex flex-col justify-center space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono tracking-tight text-foreground tabular-nums">
                {completedMinutes} / {targetMinutes} mins
              </span>
              {isCompletedToday && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-sans bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Check className="w-3 h-3" /> Met
                </span>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground leading-tight">
              {isCompletedToday ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Goal Completed! +150 XP Daily Bonus Awarded.
                </span>
              ) : remainingMinutes > 0 ? (
                `${remainingMinutes} min${remainingMinutes === 1 ? "" : "s"} remaining to seal streak`
              ) : (
                "Complete a practice session to seal streak"
              )}
            </p>
          </div>
        </div>

        {/* Goal Edit Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary border border-transparent hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
          aria-label="Edit daily practice goal"
          title="Adjust daily practice target"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <DailyGoalModal
        isOpen={isModalOpen}
        currentTargetMinutes={targetMinutes}
        onClose={() => setIsModalOpen(false)}
        onSave={onUpdateGoal}
      />
    </>
  );
};
