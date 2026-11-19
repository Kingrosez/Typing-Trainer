import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { TrendingUp, BarChart3, Activity, Zap, Clock } from "lucide-react";

export function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Analytics"
        subtitle="In-depth telemetry, finger-by-finger speed distributions, and historical trends."
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono">Average Speed</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground flex items-center justify-between">
              <span>0 <span className="text-xs font-sans text-muted-foreground font-normal">WPM</span></span>
              <Zap className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            Complete your first session
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono">Average Accuracy</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground flex items-center justify-between">
              <span>0%</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            Benchmark benchmark target 98%
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono">Completed Sessions</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground flex items-center justify-between">
              <span>0</span>
              <BarChart3 className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            Local SQLite telemetry
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono">Practice Time</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground flex items-center justify-between">
              <span>0m</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            Total active keystroke duration
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Canvas */}
      <Card className="border border-border p-6">
        <EmptyState
          icon={<TrendingUp className="w-6 h-6" />}
          title="No Practice Telemetry Recorded Yet"
          description="Complete typing tests and drills in Practice Arenas to generate finger latency heatmaps, WPM progression curves, and error distribution charts."
          actionLabel="Start a Benchmark Test"
          onAction={() => {
            window.location.href = "/typing-test";
          }}
        />
      </Card>
    </div>
  );
}

export default Analytics;
