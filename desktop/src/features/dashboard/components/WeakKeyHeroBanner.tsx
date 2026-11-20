import React from "react";
import { useNavigate } from "react-router-dom";
import type { WeakKeyDto, WeakKeyOverviewDto, WeakKeyStatus } from "@/services/api/dashboardTypes";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, AlertTriangle, ArrowRight, Zap, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

interface WeakKeyHeroBannerProps {
  recommendations: WeakKeyDto[];
  completedSessionCount: number;
  overview?: WeakKeyOverviewDto;
}

export const WeakKeyHeroBanner: React.FC<WeakKeyHeroBannerProps> = ({
  recommendations,
  completedSessionCount,
  overview,
}) => {
  const navigate = useNavigate();

  // Determine authoritative status from backend, falling back safely
  const status: WeakKeyStatus = overview?.overallStatus ?? (
    completedSessionCount === 0 || (!recommendations && completedSessionCount < 2)
      ? "INSUFFICIENT_DATA"
      : recommendations && recommendations.length > 0
        ? "WEAK"
        : "NO_RECOMMENDATIONS"
  );

  // State 1: Insufficient Data (Fewer than 20 eligible opportunities or zero sessions)
  if (status === "INSUFFICIENT_DATA") {
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
                {overview?.headline || "Algorithmic Weak-Key Remediation"}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                Telemetry Building
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {overview?.explanation ||
                "Insufficient telemetry to identify character error clusters. Log more practice keystrokes (minimum 20 eligible opportunities per character) to generate deterministic weak-key drills."}
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

  // State 2: Weak Keys Detected (Error rate > 8%)
  if (status === "WEAK") {
    const weakKeys = (recommendations ?? []).slice(0, 3);
    const keyCharsString = weakKeys.map((k) => k.keyChar.toUpperCase()).join(", ");
    const queryParam = weakKeys.map((k) => encodeURIComponent(k.keyChar)).join(",");

    return (
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-rose-500/30 bg-card text-card-foreground shadow-sm"
        aria-label="Weak-Key Remediation"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-foreground font-sans">
                {overview?.headline || "Algorithmic Weak-Key Remediation"}
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
              Keys to improve: <strong className="text-foreground">{keyCharsString}</strong> exhibit elevated friction in recent sessions. Isolating these diagonal reaches will raise your Net WPM.
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
  }

  // State 3: Developing (Error rate > 5% and <= 8%)
  if (status === "DEVELOPING") {
    return (
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-amber-500/30 bg-card text-card-foreground shadow-sm"
        aria-label="Weak-Key Remediation"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground font-sans">
                {overview?.headline || "Dexterity Developing"}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                Developing (5–8% Error)
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {overview?.explanation ||
                "Moderate friction detected. Finger dexterity is stabilizing across recent typing. Targeted repetition will advance keys into the stable tier."}
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/learning-mode")}
          size="sm"
          variant="outline"
          className="shrink-0 space-x-1.5"
        >
          <span>Refine Technique</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  // State 4: Stable (Error rate > 3% and <= 5%, or <= 3% without 3 qualifying sessions)
  if (status === "STABLE") {
    return (
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-primary/30 bg-card text-card-foreground shadow-sm"
        aria-label="Weak-Key Remediation"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground font-sans">
                {overview?.headline || "Accuracy Stabilized"}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">
                Stable (3–5% Error)
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {overview?.explanation ||
                "Target keys maintain consistent accuracy. Complete 3 consecutive clean qualifying drill sessions (>= 30 strokes, <= 3% error) to graduate keys to certified touch-typing mastery."}
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/skill-drills")}
          size="sm"
          variant="outline"
          className="shrink-0 space-x-1.5"
        >
          <span>Qualify for Mastery</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  // State 5: Mastered (Verified 3 consecutive qualifying clean drill sessions <= 3% error)
  if (status === "MASTERED") {
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
                {overview?.headline || "Flawless Precision 🌟"}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                Certified Mastery (≤ 3% Error)
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {overview?.explanation ||
                "Certified touch-typing mastery achieved! Consecutive clean qualifying sessions verified sub-3% error rate. Ready to push raw typing speed to the next tier?"}
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

  // State 6: No Current Weak-Key Recommendations (Active typing, balanced accuracy, not yet 3-session certified)
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm"
      aria-label="Weak-Key Remediation"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground font-sans">
              {overview?.headline || "Optimal Performance"}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
              No Weak Keys Detected
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {overview?.explanation ||
              "No weak keys detected across your recent sessions. Your typing maintains balanced cadence and high accuracy across standard reaches."}
          </p>
        </div>
      </div>

      <Button
        onClick={() => navigate("/typing-test")}
        size="sm"
        variant="outline"
        className="shrink-0 space-x-1.5"
      >
        <span>Maintain Momentum</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};
