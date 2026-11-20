import React from "react";
import type { UserStatusDto, DailyGoalDto } from "@/services/api/dashboardTypes";
import { Flame, Shield, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface GamificationProgressionWidgetProps {
  userStatus: UserStatusDto;
  dailyGoal: DailyGoalDto;
  isLoading?: boolean;
}

export const GamificationProgressionWidget: React.FC<GamificationProgressionWidgetProps> = ({
  userStatus,
  dailyGoal,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div
        className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm animate-pulse h-full flex flex-col justify-between"
        aria-label="Loading Gamification Progression"
      >
        <div className="flex justify-between items-center">
          <div className="h-6 w-40 bg-secondary rounded" />
          <div className="h-5 w-24 bg-secondary rounded-full" />
        </div>
        <div className="space-y-2 my-4">
          <div className="h-3 w-full bg-secondary/50 rounded-full" />
          <div className="h-4 w-52 bg-secondary/70 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 bg-secondary rounded" />
          <div className="h-5 w-36 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  const {
    currentLevel,
    currentTier,
    totalXp,
    xpProgressInLevel,
    xpRequiredForNextLevel,
    levelProgressPercentage,
    currentStreakDays,
    longestStreakDays,
    freezeShieldsAvailable,
  } = userStatus;

  // Authoritative percentage fallback with safe zero-division handling
  const safePercent =
    levelProgressPercentage ??
    (xpRequiredForNextLevel > 0
      ? Math.min(100.0, Math.round(((xpProgressInLevel / xpRequiredForNextLevel) * 1000.0)) / 10.0)
      : 0.0);

  const clampedPercent = Math.max(0, Math.min(100, safePercent));
  const remainingXp = Math.max(0, xpRequiredForNextLevel - xpProgressInLevel);
  const isNewUser = currentLevel === 1 && totalXp === 0;

  return (
    <div
      className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm h-full flex flex-col justify-between"
      aria-label="Gamification Progression and Streak Hub"
    >
      {/* Header: Level Crest & Tier Identity */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex flex-col items-center justify-center font-bold shadow-sm shadow-blue-500/20 shrink-0"
            aria-hidden="true"
          >
            <span className="text-[10px] uppercase tracking-wider font-mono opacity-80 leading-none">LVL</span>
            <span className="text-base font-extrabold leading-none mt-0.5">{currentLevel}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground font-sans tracking-tight">
                Level {currentLevel}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {currentTier}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              Total: {totalXp.toLocaleString()} XP
            </p>
          </div>
        </div>

        {/* Daily Goal Status Pill */}
        <div>
          {dailyGoal.isCompletedToday ? (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
              title="Daily practice threshold met. +150 XP bonus recorded in ledger."
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Goal Met (+150 XP)</span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground text-xs font-medium"
              title="Practice today to reach your goal and advance your streak."
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Goal: {dailyGoal.progressPercentage.toFixed(0)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar and XP Progression */}
      <div className="my-3 space-y-1.5">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-foreground font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Progress to Level {currentLevel + 1}</span>
          </span>
          <span className="text-muted-foreground font-medium">
            {xpProgressInLevel.toLocaleString()} / {xpRequiredForNextLevel.toLocaleString()} XP ({clampedPercent.toFixed(1)}%)
          </span>
        </div>

        <div
          className="relative w-full h-3 rounded-full bg-secondary overflow-hidden border border-border/40"
          role="progressbar"
          aria-valuenow={clampedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress to Level ${currentLevel + 1}: ${clampedPercent.toFixed(1)} percent`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${clampedPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-muted-foreground">
          {isNewUser ? (
            <span className="text-primary font-medium">
              Complete your first practice session to earn Base Effort XP & begin leveling.
            </span>
          ) : (
            <span>
              {remainingXp.toLocaleString()} XP remaining to unlock next tier rewards
            </span>
          )}
          <span className="font-mono text-[10px] text-muted-foreground/80">
            XP formula: round(120 × L^1.35)
          </span>
        </div>
      </div>

      {/* Footer: Streak and Streak Freeze Inventory */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-xs flex-wrap gap-2">
        {/* Streak Details */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 text-foreground font-semibold"
            title={
              currentStreakDays > 0
                ? `Active streak: ${currentStreakDays} days of reaching your practice goal.`
                : "Meet your daily goal today to start a streak."
            }
          >
            <Flame className={`w-4 h-4 ${currentStreakDays > 0 ? "text-amber-500 fill-amber-500/20 animate-pulse" : "text-muted-foreground"}`} />
            <span>
              {currentStreakDays} {currentStreakDays === 1 ? "Day" : "Days"} Streak
            </span>
          </div>
          {longestStreakDays > 0 && (
            <span className="text-[11px] text-muted-foreground font-mono">
              (Best: {longestStreakDays}d)
            </span>
          )}
        </div>

        {/* Streak Freeze Inventory */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60 text-xs"
          title={`Streak Freeze: 1 shield earned per 7 consecutive days of daily goals (max 2). Currently holding ${freezeShieldsAvailable} shield(s).`}
        >
          <div className="flex items-center gap-0.5" aria-hidden="true">
            <Shield className={`w-3.5 h-3.5 ${freezeShieldsAvailable >= 1 ? "text-cyan-500 fill-cyan-500/30" : "text-muted-foreground/40"}`} />
            <Shield className={`w-3.5 h-3.5 ${freezeShieldsAvailable >= 2 ? "text-cyan-500 fill-cyan-500/30" : "text-muted-foreground/40"}`} />
          </div>
          <span className="font-mono font-medium text-foreground">
            {freezeShieldsAvailable} / 2
          </span>
          <span className="text-[11px] text-muted-foreground">
            Freeze {freezeShieldsAvailable === 1 ? "Shield" : "Shields"}
          </span>
        </div>
      </div>
    </div>
  );
};
