import React from "react";
import { useNavigate } from "react-router-dom";
import type { WeakKeyDto } from "@/services/api/dashboardTypes";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, AlertTriangle, ArrowRight, Zap } from "lucide-react";

interface WeakKeyHeroBannerProps {
  recommendations: WeakKeyDto[];
  completedSessionCount: number;
}

export const WeakKeyHeroBanner: React.FC<WeakKeyHeroBannerProps> = ({
  recommendations,
  completedSessionCount,
}) => {
  const navigate = useNavigate();

  // State 1: Insufficient Telemetry (User has 0 sessions or not enough keystrokes to evaluate keys)
  if (completedSessionCount === 0) {
    return (
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm"
        aria-label="Weak-Key Remediation"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-muted-foreground shrink-0 mt-0.5">
            <Target className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground font-sans">
                Algorithmic Weak-Key Remediation
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                Telemetry Building
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Insufficient telemetry to identify character error clusters. Log more practice keystrokes (minimum 20 eligible opportunities per character) to generate deterministic weak-key drills.
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/typing-test")}
          size="sm"
          variant="outline"
          className="shrink-0 space-x-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Start Baseline Test →</span>
        </Button>
      </div>
    );
  }

  // State 2: Mastery / Flawless Precision State (User has sessions, but 0 weak keys detected)
  if (!recommendations || recommendations.length === 0) {
    return (
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-card text-card-foreground shadow-sm"
        aria-label="Weak-Key Remediation"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground font-sans">
                Flawless Precision 🌟
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Mastery (≤ 3% Error Rate)
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              No significant weak keys detected across your recent sessions! Your finger cadence and diagonal reaches maintain high accuracy. Ready to push your raw typing speed to the next tier?
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/typing-test")}
          size="sm"
          className="shrink-0 space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          <span>Speed Sprint Attack</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  // State 3: Weak Keys Detected (Remediation Mode)
  const weakKeys = recommendations.slice(0, 3);
  const keyCharsString = weakKeys.map((k) => k.keyChar.toUpperCase()).join(", ");
  const queryParam = weakKeys.map((k) => encodeURIComponent(k.keyChar)).join(",");

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-primary/40 bg-card text-card-foreground shadow-sm"
      aria-label="Weak-Key Remediation"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-foreground font-sans">
              Algorithmic Weak-Key Remediation
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold">
              Action Recommended
            </span>
          </div>

          {/* Weak Key Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {weakKeys.map((item) => (
              <span
                key={item.keyChar}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary border border-border text-xs font-mono"
              >
                <span className="px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold">
                  {item.keyChar.toUpperCase()}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {item.accuracy.toFixed(0)}% Acc
                </span>
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Keys to improve: <strong className="text-foreground">{keyCharsString}</strong> have higher error rates in recent sessions. Isolating these diagonal reaches will raise your Net WPM.
          </p>
        </div>
      </div>

      <Button
        onClick={() => navigate(`/skill-drills?keys=${queryParam}`)}
        size="sm"
        className="shrink-0 space-x-1.5 shadow-sm"
      >
        <span>Practice Weak Keys (3m Drill)</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};
