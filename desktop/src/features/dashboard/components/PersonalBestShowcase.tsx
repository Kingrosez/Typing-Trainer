import React from "react";
import type { PersonalBestsDto } from "@/services/api/dashboardTypes";
import { Zap, Trophy, Code2, Timer, Sparkles } from "lucide-react";

interface PersonalBestShowcaseProps {
  personalBests: PersonalBestsDto;
  isLoading?: boolean;
}

export const PersonalBestShowcase: React.FC<PersonalBestShowcaseProps> = ({
  personalBests,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div
        className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm animate-pulse h-full flex flex-col justify-between"
        aria-label="Loading Personal Bests"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="h-6 w-36 bg-secondary rounded" />
          <div className="h-4 w-28 bg-secondary/70 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2.5 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-2.5 rounded-lg border border-border/50 bg-secondary/30 space-y-1.5">
              <div className="h-3 w-20 bg-secondary rounded" />
              <div className="h-6 w-16 bg-secondary rounded" />
              <div className="h-2.5 w-24 bg-secondary/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const {
    best15sWpm,
    best60sWpm,
    bestDevModeWpm,
    longestSessionSeconds,
    best15sAccuracy,
    best60sAccuracy,
    bestDevModeAccuracy,
    longestSessionAccuracy,
    best15sDate,
    best60sDate,
    bestDevModeDate,
    longestSessionDate,
  } = personalBests;

  const formatDate = (dateStr?: string | null): string | null => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const formatDuration = (seconds?: number | null): string => {
    if (seconds == null) return "—";
    const rounded = Math.round(seconds);
    if (rounded < 60) return `${rounded}s`;
    const mins = Math.floor(rounded / 60);
    const secs = rounded % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  const allRecordsNull =
    best15sWpm == null &&
    best60sWpm == null &&
    bestDevModeWpm == null &&
    longestSessionSeconds == null;

  return (
    <div
      className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm h-full flex flex-col justify-between"
      aria-label="Personal Best Showcase"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <h3 className="text-base font-bold text-foreground font-sans tracking-tight">
            Personal Best Showcase
          </h3>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Verified Benchmarks (≥95% Acc)
        </span>
      </div>

      {allRecordsNull ? (
        <div className="flex flex-col items-center justify-center flex-1 py-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground/60 mb-2">
            <Sparkles className="w-5 h-5 text-amber-500/50" />
          </div>
          <p className="text-xs font-semibold text-foreground">No Verified Benchmarks Yet</p>
          <p className="text-[11px] text-muted-foreground max-w-xs mt-0.5">
            Complete a 15s speed sprint, 60s test, or code drill with ≥95% accuracy to earn official records.
          </p>
        </div>
      ) : (
        /* 4-Card Benchmark Grid */
        <div className="grid grid-cols-2 gap-2.5 flex-1">
          {/* Card 1: 15s Sprint */}
          <div
            className={`p-2.5 rounded-lg border transition-all ${
              best15sWpm != null
                ? "bg-secondary/40 border-border/80"
                : "bg-secondary/20 border-dashed border-border/50 opacity-75"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-500 shrink-0" />
                <span>15s Sprint</span>
              </span>
              {best15sWpm != null && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  Sprint
                </span>
              )}
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold font-mono tracking-tight text-foreground">
                {best15sWpm != null ? `${Math.round(best15sWpm)} WPM` : "— WPM"}
              </span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center justify-between gap-1">
              {best15sAccuracy != null ? (
                <span className="text-emerald-500 font-semibold">{best15sAccuracy.toFixed(1)}% Acc</span>
              ) : (
                <span>≥95% required</span>
              )}
              {formatDate(best15sDate) && (
                <span className="text-muted-foreground/80 truncate">{formatDate(best15sDate)}</span>
              )}
            </div>
          </div>

          {/* Card 2: Official 60s Benchmark (Featured / Golden Accent) */}
          <div
            className={`p-2.5 rounded-lg border transition-all relative overflow-hidden ${
              best60sWpm != null
                ? "bg-amber-500/5 dark:bg-amber-400/5 border-amber-500/40 dark:border-amber-400/30 shadow-sm shadow-amber-500/5"
                : "bg-secondary/20 border-dashed border-border/50 opacity-75"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                <span>60s Benchmark</span>
              </span>
              {best60sWpm != null && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                  Official
                </span>
              )}
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold font-mono tracking-tight text-foreground">
                {best60sWpm != null ? `${Math.round(best60sWpm)} WPM` : "— WPM"}
              </span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center justify-between gap-1">
              {best60sAccuracy != null ? (
                <span className="text-emerald-500 font-semibold">{best60sAccuracy.toFixed(1)}% Acc</span>
              ) : (
                <span>Standard corpus</span>
              )}
              {formatDate(best60sDate) && (
                <span className="text-muted-foreground/80 truncate">{formatDate(best60sDate)}</span>
              )}
            </div>
          </div>

          {/* Card 3: Developer Mode */}
          <div
            className={`p-2.5 rounded-lg border transition-all ${
              bestDevModeWpm != null
                ? "bg-secondary/40 border-border/80"
                : "bg-secondary/20 border-dashed border-border/50 opacity-75"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Code2 className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>Dev Studio</span>
              </span>
              {bestDevModeWpm != null && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  Syntax
                </span>
              )}
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold font-mono tracking-tight text-foreground">
                {bestDevModeWpm != null ? `${Math.round(bestDevModeWpm)} WPM` : "— WPM"}
              </span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center justify-between gap-1">
              {bestDevModeAccuracy != null ? (
                <span className="text-emerald-500 font-semibold">{bestDevModeAccuracy.toFixed(1)}% Acc</span>
              ) : (
                <span>Code syntax</span>
              )}
              {formatDate(bestDevModeDate) && (
                <span className="text-muted-foreground/80 truncate">{formatDate(bestDevModeDate)}</span>
              )}
            </div>
          </div>

          {/* Card 4: Longest Session */}
          <div
            className={`p-2.5 rounded-lg border transition-all ${
              longestSessionSeconds != null
                ? "bg-secondary/40 border-border/80"
                : "bg-secondary/20 border-dashed border-border/50 opacity-75"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Timer className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Longest Session</span>
              </span>
              {longestSessionSeconds != null && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Cadence
                </span>
              )}
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold font-mono tracking-tight text-foreground">
                {formatDuration(longestSessionSeconds)}
              </span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center justify-between gap-1">
              {longestSessionAccuracy != null ? (
                <span className="text-emerald-500 font-semibold">{longestSessionAccuracy.toFixed(1)}% Acc</span>
              ) : (
                <span>Single sitting</span>
              )}
              {formatDate(longestSessionDate) && (
                <span className="text-muted-foreground/80 truncate">{formatDate(longestSessionDate)}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
