import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Zap, AlertCircle, RefreshCw } from "lucide-react";
import { dashboardService } from "@/services/api/dashboardService";
import type { DashboardSummaryResponse } from "@/services/api/dashboardTypes";
import { WelcomeStatusHeader } from "./components/WelcomeStatusHeader";
import { DailyGoalCapsule } from "./components/DailyGoalCapsule";
import { PrimaryMetricCards } from "./components/PrimaryMetricCards";
import { WeeklyActivityChart } from "./components/WeeklyActivityChart";
import { WpmTrendChart } from "./components/WpmTrendChart";
import { WeakKeyHeroBanner } from "./components/WeakKeyHeroBanner";
import { QuickPracticeCards } from "./components/QuickPracticeCards";
import { DashboardSkeleton } from "./components/DashboardSkeleton";

const DEFAULT_OFFLINE_SUMMARY: DashboardSummaryResponse = {
  userStatus: {
    displayName: "Typist",
    currentLevel: 1,
    currentTier: "Novice",
    totalXp: 0,
    xpProgressInLevel: 0,
    xpRequiredForNextLevel: 120,
    currentStreakDays: 0,
    longestStreakDays: 0,
    freezeShieldsAvailable: 0,
  },
  dailyGoal: {
    targetMinutes: 20,
    completedSecondsToday: 0,
    remainingSecondsToday: 1200,
    progressPercentage: 0,
    isCompletedToday: false,
  },
  primaryMetrics: {
    bestWpm: null,
    averageWpm: null,
    accuracy: null,
    totalPracticeSeconds: 0,
    completedSessionCount: 0,
    currentSessionWpm: null,
  },
  weeklyActivity: [],
  wpmTrend: [],
  weakKeyRecommendations: [],
  personalBests: {
    best15sWpm: null,
    best60sWpm: null,
    bestDevModeWpm: null,
    longestSessionSeconds: null,
  },
  recentSessions: [],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingGoal, setIsUpdatingGoal] = useState<boolean>(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardSummary();
      setSummary(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to reach local backend service";
      setError(message);
      // Fallback to default offline structure so UI remains operable
      setSummary((prev) => prev ?? DEFAULT_OFFLINE_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateDailyGoal = async (targetMinutes: number) => {
    setIsUpdatingGoal(true);
    try {
      const updatedGoal = await dashboardService.updateDailyGoal({ targetMinutes });
      setSummary((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          dailyGoal: updatedGoal,
        };
      });
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Your personalized typing command center. Pick up where you left off or jump into practice."
        actions={
          <Button
            onClick={() => navigate("/typing-test")}
            className="space-x-1.5 shadow-sm"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Start Practice Test</span>
          </Button>
        }
      />

      {/* Non-blocking Error / Offline Recovery Banner */}
      {error && (
        <div
          className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              Local backend is currently offline or synchronizing ({error}). Displaying local view.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="h-7 text-xs border-amber-500/30 hover:bg-amber-500/10 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>Retry Connection</span>
          </Button>
        </div>
      )}

      {/* Loading Skeleton vs Live Widgets */}
      {loading && !summary ? (
        <DashboardSkeleton />
      ) : summary ? (
        <div className="space-y-6">
          {/* Row 0: Welcome Header (W-01) & Daily Goal Capsule (W-02) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            <div className="lg:col-span-7 xl:col-span-8 p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
              <WelcomeStatusHeader
                userStatus={summary.userStatus}
                completedSessionCount={summary.primaryMetrics.completedSessionCount}
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-4">
              <DailyGoalCapsule
                dailyGoal={summary.dailyGoal}
                onUpdateGoal={handleUpdateDailyGoal}
                isLoading={isUpdatingGoal}
              />
            </div>
          </div>

          {/* Row 1: Four Primary Metric Cards (W-03) */}
          <PrimaryMetricCards metrics={summary.primaryMetrics} />

          {/* Row 2: Dual Telemetry Charts (W-04 & W-05) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            <WeeklyActivityChart
              weeklyActivity={summary.weeklyActivity}
              targetMinutes={summary.dailyGoal.targetMinutes}
            />
            <WpmTrendChart wpmTrend={summary.wpmTrend} />
          </div>

          {/* Row 3: Algorithmic Weak-Key Remediation Banner (W-06) */}
          <WeakKeyHeroBanner
            recommendations={summary.weakKeyRecommendations}
            completedSessionCount={summary.primaryMetrics.completedSessionCount}
            overview={summary.weakKeyOverview}
          />

          {/* Row 4: Quick Practice Portals (W-07) */}
          <QuickPracticeCards />
        </div>
      ) : null}
    </div>
  );
}
