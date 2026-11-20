import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading dashboard...">
      {/* Row 0: Header & Goal Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-8 p-4 rounded-xl border border-border bg-card/50 space-y-3">
          <div className="h-7 w-64 bg-secondary rounded-lg" />
          <div className="h-4 w-96 max-w-full bg-secondary/70 rounded-md" />
        </div>
        <div className="lg:col-span-4 p-4 rounded-xl border border-border bg-card/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-secondary shrink-0" />
            <div className="space-y-2">
              <div className="h-5 w-28 bg-secondary rounded" />
              <div className="h-3 w-36 bg-secondary/70 rounded" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-secondary" />
        </div>
      </div>

      {/* Row 1: Four Primary Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-border bg-card/50 space-y-3 h-28">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 bg-secondary rounded" />
              <div className="h-4 w-12 bg-secondary/70 rounded-full" />
            </div>
            <div className="h-8 w-20 bg-secondary rounded" />
            <div className="h-3 w-32 bg-secondary/70 rounded" />
          </div>
        ))}
      </div>

      {/* Row 2: Dual Telemetry Charts Skeleton (Weekly Activity & WPM Trend) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card/50 space-y-4 h-64">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="h-4 w-40 bg-secondary rounded" />
              <div className="h-3 w-52 bg-secondary/70 rounded" />
            </div>
            <div className="h-3 w-28 bg-secondary/70 rounded" />
          </div>
          <div className="h-36 bg-secondary/30 rounded-lg" />
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50 space-y-4 h-64">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="h-4 w-44 bg-secondary rounded" />
              <div className="h-3 w-48 bg-secondary/70 rounded" />
            </div>
            <div className="h-3 w-24 bg-secondary/70 rounded" />
          </div>
          <div className="h-36 bg-secondary/30 rounded-lg" />
        </div>
      </div>

      {/* Row 3: Weak-Key Recommendation Banner Skeleton */}
      <div className="p-5 rounded-xl border border-border bg-card/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-32 sm:h-24">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-secondary rounded" />
            <div className="h-3 w-80 max-w-full bg-secondary/70 rounded" />
          </div>
        </div>
        <div className="h-9 w-44 bg-secondary rounded-lg shrink-0" />
      </div>

      {/* Row 4: Quick Practice Cards Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-secondary rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-card/50 space-y-3 h-32">
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-lg bg-secondary" />
                <div className="h-4 w-10 bg-secondary/70 rounded" />
              </div>
              <div className="h-4 w-24 bg-secondary rounded" />
              <div className="h-3 w-32 bg-secondary/70 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 5: Gamification & Personal Best Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card/50 space-y-3 h-44" />
        <div className="p-5 rounded-xl border border-border bg-card/50 space-y-3 h-44" />
      </div>

      {/* Row 6: Recent Sessions Table Skeleton */}
      <div className="p-5 rounded-xl border border-border bg-card/50 space-y-3 h-52" />
    </div>
  );
};
