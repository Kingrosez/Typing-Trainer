import React from "react";
import type { UserStatusDto } from "@/services/api/dashboardTypes";
import { Flame, Sparkles } from "lucide-react";

interface WelcomeStatusHeaderProps {
  userStatus: UserStatusDto;
  completedSessionCount: number;
}

export const WelcomeStatusHeader: React.FC<WelcomeStatusHeaderProps> = ({
  userStatus,
  completedSessionCount,
}) => {
  const isNewUser = completedSessionCount === 0;
  const { displayName, currentLevel, currentTier, currentStreakDays } = userStatus;

  return (
    <header className="flex flex-col justify-center h-full space-y-1.5" aria-label="Welcome and User Status">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {isNewUser ? `Welcome to Typing Trainer, ${displayName}! ⌨` : `Welcome back, ${displayName}! 👋`}
        </h1>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
          aria-label={`Rank: Level ${currentLevel}, ${currentTier}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span>
            Level {currentLevel} • {currentTier}
          </span>
        </div>
        {currentStreakDays > 0 && (
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            aria-label={`${currentStreakDays}-day practice streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>{currentStreakDays}d streak</span>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {isNewUser ? (
          "An offline desktop application engineered to build touch-typing speed, accuracy, and muscle memory through structured drills and instant feedback."
        ) : currentStreakDays > 0 ? (
          `Ready to build muscle memory today? You are on a ${currentStreakDays}-day practice streak.`
        ) : (
          "Ready to build muscle memory today? Complete a practice session to start your daily streak."
        )}
      </p>
    </header>
  );
};
