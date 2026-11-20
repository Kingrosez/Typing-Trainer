import React from "react";
import type { WeeklyActivityDayDto } from "@/services/api/dashboardTypes";
import { Check, Minus } from "lucide-react";

interface WeeklyActivityChartProps {
  weeklyActivity: WeeklyActivityDayDto[];
  targetMinutes: number;
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  weeklyActivity,
  targetMinutes,
}) => {
  // Ensure we have 7 days or handle empty data
  const days = weeklyActivity ?? [];
  const completedDaysCount = days.filter((d) => d.goalMet).length;
  const totalSecondsTyped = days.reduce((acc, d) => acc + d.durationSeconds, 0);
  const totalMinutesTyped = Math.round(totalSecondsTyped / 60);

  // Maximum value for scaling (at least target * 1.4 or highest duration)
  const maxRecordedMinutes = Math.max(
    0,
    ...days.map((d) => Math.round(d.durationSeconds / 60))
  );
  const chartMaxMinutes = Math.max(targetMinutes * 1.4, maxRecordedMinutes, 25);

  const goalLinePercentage = Math.min(
    95,
    Math.max(10, (targetMinutes / chartMaxMinutes) * 100)
  );

  return (
    <div
      className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm h-full"
      aria-label="Weekly Practice Activity"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground font-sans">
            Weekly Practice Activity
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            7-day practice duration & goal completion
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" aria-hidden="true" />
            <span>Goal Met ({completedDaysCount}/7)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 border-t border-dashed border-primary" aria-hidden="true" />
            <span>Target ({targetMinutes}m)</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div
        className="relative flex-1 min-h-[140px] flex items-end justify-between gap-2 pt-6 pb-2"
        role="img"
        aria-label={`Weekly summary: ${completedDaysCount} of 7 days completed. Total time: ${totalMinutesTyped} minutes.`}
      >
        {/* Dashed Target Goal Threshold Line */}
        <div
          className="absolute inset-x-0 border-t border-dashed border-primary/50 pointer-events-none z-10 flex items-center justify-end pr-1"
          style={{ bottom: `${goalLinePercentage}%` }}
          aria-hidden="true"
        >
          <span className="text-[10px] font-mono text-primary/70 bg-card/80 px-1 rounded -translate-y-2.5">
            {targetMinutes}m goal
          </span>
        </div>

        {/* 7 Day Columns */}
        {days.map((day) => {
          const minutes = Math.round(day.durationSeconds / 60);
          const barHeightPct = Math.min(
            100,
            Math.max(4, (minutes / chartMaxMinutes) * 100)
          );

          return (
            <div
              key={day.date}
              className={`flex-1 flex flex-col items-center justify-end h-full relative group ${
                day.isToday ? "rounded-lg ring-2 ring-primary/40 p-1" : ""
              }`}
            >
              {/* Tooltip on Hover */}
              <div
                className="absolute -top-7 hidden group-hover:flex items-center justify-center px-2 py-0.5 rounded bg-popover text-popover-foreground text-[10px] font-mono shadow border border-border pointer-events-none z-20 whitespace-nowrap"
                role="tooltip"
              >
                {day.dayOfWeek} ({day.date}): {minutes} mins
              </div>

              {/* Vertical Bar */}
              <div className="w-full max-w-[36px] bg-secondary/50 rounded-t-md relative flex items-end justify-center overflow-hidden h-full">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ease-out ${
                    day.goalMet
                      ? "bg-emerald-500 dark:bg-emerald-600 shadow-sm"
                      : minutes > 0
                        ? "bg-primary/40"
                        : "bg-transparent"
                  }`}
                  style={{ height: `${barHeightPct}%` }}
                />
              </div>

              {/* Status Glyph Badge */}
              <div className="mt-1.5 flex items-center justify-center w-4 h-4">
                {day.goalMet ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" aria-hidden="true" />
                ) : (
                  <Minus className="w-3 h-3 text-muted-foreground/40" aria-hidden="true" />
                )}
              </div>

              {/* Day Label */}
              <span
                className={`text-[11px] font-mono mt-0.5 ${
                  day.isToday
                    ? "font-bold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {day.dayOfWeek}
              </span>

              {/* Minutes Label */}
              <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
                {minutes}m
              </span>
            </div>
          );
        })}
      </div>

      {/* Screen Reader Accessible Table Fallback */}
      <table className="sr-only">
        <caption>7-Day Weekly Practice Activity and Goal Completion</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Date</th>
            <th scope="col">Minutes Typed</th>
            <th scope="col">Daily Goal Status</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <td>{day.dayOfWeek}</td>
              <td>{day.date}</td>
              <td>{Math.round(day.durationSeconds / 60)} minutes</td>
              <td>{day.goalMet ? "Goal Met" : "Goal Not Met"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
