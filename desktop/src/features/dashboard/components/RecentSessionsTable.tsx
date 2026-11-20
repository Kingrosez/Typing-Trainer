import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { RecentSessionSummaryDto } from "@/services/api/dashboardTypes";
import type { TypingSessionResponse } from "@/services/api/types";
import { sessionService } from "@/services/api/sessionService";
import { History, ChevronLeft, ChevronRight, Zap, RefreshCw, AlertCircle, Trophy, BookOpen, Target, Code2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentSessionsTableProps {
  initialSessions: RecentSessionSummaryDto[];
  isLoading?: boolean;
}

// Normalized internal row type reconciling DashboardSummaryDto and TypingSessionResponse
interface DisplaySessionRow {
  id: string;
  sessionMode: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  totalErrors: number;
  durationSeconds: number;
  xpEarned: number;
  completedAt: string;
  isOfficialBenchmark?: boolean;
}

export const RecentSessionsTable: React.FC<RecentSessionsTableProps> = ({
  initialSessions,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(5);
  const [paginatedData, setPaginatedData] = useState<DisplaySessionRow[] | null>(null);
  const [totalItems, setTotalItems] = useState<number>(initialSessions.length);
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(initialSessions.length / pageSize) || 1);
  const [isPaginating, setIsPaginating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial sessions if initialSessions changes and page is 0
  useEffect(() => {
    if (page === 0 && paginatedData === null) {
      setTotalItems(initialSessions.length);
      setTotalPages(Math.max(1, Math.ceil(initialSessions.length / pageSize)));
    }
  }, [initialSessions, page, pageSize, paginatedData]);

  // Display sessions: use paginatedData if user interacted with pagination, else initialSessions
  const currentSessions: DisplaySessionRow[] =
    paginatedData !== null
      ? paginatedData
      : initialSessions.slice(0, pageSize).map((s) => ({
          ...s,
          isOfficialBenchmark: s.isOfficialBenchmark ?? false,
        }));

  const fetchPage = useCallback(
    async (targetPage: number) => {
      if (isPaginating) return; // Prevent duplicate concurrent requests
      setIsPaginating(true);
      setError(null);

      try {
        const response = await sessionService.getRecentSessions(targetPage, pageSize, "completedAt,desc");
        const mapped: DisplaySessionRow[] = response.items.map((item: TypingSessionResponse) => ({
          id: item.id,
          sessionMode: item.sessionMode || "TYPING_TEST",
          netWpm: item.netWpm,
          grossWpm: item.grossWpm,
          accuracy: item.accuracy,
          totalErrors: item.totalErrors,
          durationSeconds: item.durationSeconds,
          xpEarned: item.xpEarned,
          completedAt: item.completedAt,
          isOfficialBenchmark: item.isOfficialBenchmark,
        }));

        setPaginatedData(mapped);
        setPage(response.page);
        setTotalItems(response.totalItems);
        setTotalPages(Math.max(1, response.totalPages));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load sessions page";
        setError(msg);
      } finally {
        setIsPaginating(false);
      }
    },
    [isPaginating, pageSize]
  );

  const handleNextPage = () => {
    if (page < totalPages - 1 && !isPaginating) {
      fetchPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0 && !isPaginating) {
      fetchPage(page - 1);
    }
  };

  const formatTimestamp = (isoString?: string): string => {
    if (!isoString) return "—";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "—";
      return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "—";
    }
  };

  const formatDuration = (seconds: number): string => {
    const rounded = Math.round(seconds);
    if (rounded < 60) return `${rounded}s`;
    const mins = Math.floor(rounded / 60);
    const secs = rounded % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case "DEVELOPER_MODE":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-xs">
            <Code2 className="w-3 h-3" />
            <span>Dev Mode</span>
          </span>
        );
      case "LEARNING_MODE":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium text-xs">
            <BookOpen className="w-3 h-3" />
            <span>Learning</span>
          </span>
        );
      case "SKILL_DRILLS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium text-xs">
            <Target className="w-3 h-3" />
            <span>Weak Keys</span>
          </span>
        );
      case "TYPING_GAMES":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium text-xs">
            <Gamepad2 className="w-3 h-3" />
            <span>Arcade</span>
          </span>
        );
      case "TYPING_TEST":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-xs">
            <Zap className="w-3 h-3" />
            <span>Typing Test</span>
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div
        className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm animate-pulse space-y-4"
        aria-label="Loading Recent Practice Sessions"
      >
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-secondary rounded" />
          <div className="h-4 w-32 bg-secondary/70 rounded" />
        </div>
        <div className="h-44 bg-secondary/30 rounded-lg" />
      </div>
    );
  }

  const isEmpty = currentSessions.length === 0;

  return (
    <div
      className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm space-y-4"
      aria-label="Recent Practice Sessions Audit Log"
    >
      {/* Table Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary shrink-0" />
          <h3 className="text-base font-bold text-foreground font-sans tracking-tight">
            Recent Practice Sessions
          </h3>
          <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
            {totalItems} {totalItems === 1 ? "Session" : "Sessions"}
          </span>
        </div>

        {/* Status / Pagination Summary */}
        <div className="text-xs font-mono text-muted-foreground">
          {!isEmpty && (
            <span>
              Page {page + 1} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {/* Error Callout if Pagination Fails */}
      {error && (
        <div
          className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPage(page)}
            className="h-7 text-xs border-destructive/30 hover:bg-destructive/10"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* Main Content: Empty State vs Semantic Accessible Table */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <History className="w-8 h-8 text-muted-foreground/40 mb-2" />
          <p className="text-xs font-semibold text-foreground">No practice sessions recorded yet</p>
          <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
            Start a typing test, learning drill, or code sprint to log your historical telemetry.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/typing-test")}
            className="mt-3 text-xs gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Start Practice Test</span>
          </Button>
        </div>
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-border/70">
          <table className="w-full text-left text-xs text-foreground font-sans">
            <caption className="sr-only">Recent completed typing practice sessions</caption>
            <thead className="bg-secondary/60 text-muted-foreground font-mono text-[11px] uppercase tracking-wider border-b border-border/60">
              <tr>
                <th scope="col" className="px-3.5 py-2.5 font-semibold">
                  Date & Time
                </th>
                <th scope="col" className="px-3 py-2.5 font-semibold">
                  Practice Mode
                </th>
                <th scope="col" className="px-3 py-2.5 font-semibold">
                  Duration
                </th>
                <th scope="col" className="px-3 py-2.5 font-semibold">
                  Net Speed
                </th>
                <th scope="col" className="px-3 py-2.5 font-semibold">
                  Accuracy
                </th>
                <th scope="col" className="px-3 py-2.5 font-semibold">
                  XP Earned
                </th>
                <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {currentSessions.map((session) => {
                const acc = session.accuracy;
                const accColor =
                  acc >= 95.0
                    ? "text-emerald-500 dark:text-emerald-400"
                    : acc >= 90.0
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-rose-500 dark:text-rose-400";

                return (
                  <tr
                    key={session.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    {/* Date & Time */}
                    <td className="px-3.5 py-2.5 text-foreground whitespace-nowrap">
                      {formatTimestamp(session.completedAt)}
                    </td>

                    {/* Mode */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {getModeBadge(session.sessionMode)}
                    </td>

                    {/* Duration */}
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {formatDuration(session.durationSeconds)}
                    </td>

                    {/* Net Speed */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-foreground text-sm">
                          {session.netWpm != null ? Math.round(session.netWpm) : "--"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">WPM</span>
                        <span className="text-[10px] text-muted-foreground/60 ml-1">
                          (Raw: {Math.round(session.grossWpm)})
                        </span>
                      </div>
                    </td>

                    {/* Accuracy */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`font-semibold ${accColor}`}>
                        {session.accuracy.toFixed(1)}%
                      </span>
                      {session.totalErrors > 0 && (
                        <span className="text-[10px] text-muted-foreground ml-1">
                          ({session.totalErrors} err)
                        </span>
                      )}
                    </td>

                    {/* XP Earned */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        +{session.xpEarned} XP
                      </span>
                    </td>

                    {/* Benchmark Status */}
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      {session.isOfficialBenchmark ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          <span>Official</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[11px]">
                          Practice
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!isEmpty && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs font-mono">
          <span className="text-muted-foreground text-[11px]">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, totalItems)} of {totalItems} sessions
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 0 || isPaginating}
              className="h-7 px-2.5 text-xs gap-1 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </Button>

            <span className="px-2 text-muted-foreground text-[11px]">
              {page + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page >= totalPages - 1 || isPaginating}
              className="h-7 px-2.5 text-xs gap-1 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
