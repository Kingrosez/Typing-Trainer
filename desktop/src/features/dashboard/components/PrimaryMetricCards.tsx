import React from "react";
import type { PrimaryMetricsDto } from "@/services/api/dashboardTypes";
import { Zap, TrendingUp, Target, Clock } from "lucide-react";

interface PrimaryMetricCardsProps {
  metrics: PrimaryMetricsDto;
}

export const PrimaryMetricCards: React.FC<PrimaryMetricCardsProps> = ({ metrics }) => {
  const {
    bestWpm,
    averageWpm,
    accuracy,
    totalPracticeSeconds,
    completedSessionCount,
  } = metrics;

  // Format practice time into readable hours and minutes
  const totalMinutes = Math.floor(totalPracticeSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const practiceTimeString =
    hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins}m`;

  return (
    <dl
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="Primary Performance Metrics"
    >
      {/* Card 1: BEST WPM */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <dt className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>BEST WPM</span>
          </dt>
          {bestWpm !== null && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              60s PB
            </span>
          )}
        </div>
        <dd className="mt-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
            {bestWpm !== null ? (
              <>
                {Math.round(bestWpm)}{" "}
                <span className="text-xs font-sans font-normal text-muted-foreground">WPM</span>
              </>
            ) : (
              <span className="text-muted-foreground font-normal">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {bestWpm !== null
              ? "Official 60s test (≥ 95% Acc)"
              : "No 60s benchmark recorded yet"}
          </p>
        </dd>
      </div>

      {/* Card 2: AVERAGE WPM */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <dt className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <span>AVERAGE WPM</span>
          </dt>
          {averageWpm !== null && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Trailing Mean
            </span>
          )}
        </div>
        <dd className="mt-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
            {averageWpm !== null ? (
              <>
                {averageWpm.toFixed(1)}{" "}
                <span className="text-xs font-sans font-normal text-muted-foreground">WPM</span>
              </>
            ) : (
              <span className="text-muted-foreground font-normal">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {averageWpm !== null
              ? "Average speed across sessions"
              : "No sessions recorded yet"}
          </p>
        </dd>
      </div>

      {/* Card 3: ACCURACY */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <dt className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <span>ACCURACY</span>
          </dt>
          {accuracy !== null && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                accuracy >= 95.0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              {accuracy >= 95.0 ? "Target Met" : "Target: ≥ 95%"}
            </span>
          )}
        </div>
        <dd className="mt-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
            {accuracy !== null ? (
              `${accuracy.toFixed(1)}%`
            ) : (
              <span className="text-muted-foreground font-normal">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {accuracy !== null
              ? "Weighted all-time keystroke precision"
              : "Target: ≥ 95% Precision"}
          </p>
        </dd>
      </div>

      {/* Card 4: PRACTICE TIME */}
      <div className="flex flex-col justify-between p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <dt className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-500" aria-hidden="true" />
            <span>PRACTICE TIME</span>
          </dt>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {completedSessionCount} {completedSessionCount === 1 ? "Session" : "Sessions"}
          </span>
        </div>
        <dd className="mt-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
            {practiceTimeString}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedSessionCount > 0
              ? `Logged across ${completedSessionCount} session${completedSessionCount === 1 ? "" : "s"}`
              : "Start practicing to track time"}
          </p>
        </dd>
      </div>
    </dl>
  );
};
