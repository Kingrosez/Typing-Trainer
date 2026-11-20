import React, { useState } from "react";
import type { WpmTrendPointDto } from "@/services/api/dashboardTypes";
import { TrendingUp } from "lucide-react";

interface WpmTrendChartProps {
  wpmTrend: WpmTrendPointDto[];
}

export const WpmTrendChart: React.FC<WpmTrendChartProps> = ({ wpmTrend }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chronological ordering: Ensure data points are sorted chronologically and capped at latest 15 sessions
  const rawPoints = (wpmTrend ?? []).filter((p): p is WpmTrendPointDto => p != null);
  const sortedPoints = [...rawPoints].sort((a, b) =>
    (a.completedAt ?? "").localeCompare(b.completedAt ?? "")
  );
  const points = sortedPoints.slice(-15).map((p) => ({
    ...p,
    netWpm: Number.isFinite(p.netWpm) ? Math.max(0, p.netWpm) : 0,
    grossWpm: Number.isFinite(p.grossWpm) ? Math.max(0, p.grossWpm) : 0,
    accuracy: Number.isFinite(p.accuracy) ? Math.max(0, Math.min(100, p.accuracy)) : 0,
    totalErrors: Number.isFinite(p.totalErrors) ? Math.max(0, p.totalErrors) : 0,
  }));

  const count = points.length;

  if (count === 0) {
    return (
      <div
        className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm h-full"
        aria-label="Speed and Consistency Trend"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground font-sans">
            Speed & Consistency Trend
          </h3>
          <span className="text-xs font-mono text-muted-foreground">Last 15 Sessions</span>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 py-8 text-center text-muted-foreground">
          <TrendingUp className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs font-medium">No sessions recorded yet</p>
          <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-xs">
            Start your first practice session to build your speed and consistency curve.
          </p>
        </div>
      </div>
    );
  }

  if (count === 1) {
    const singlePoint = points[0]!;
    return (
      <div
        className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm h-full"
        aria-label="Speed and Consistency Trend"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground font-sans">
              Speed & Consistency Trend
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">1 session recorded</p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Last 15 Sessions</span>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 py-6 text-center text-muted-foreground">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-foreground text-xs font-mono mb-2">
            <span>Session 1:</span>
            <span className="font-bold text-primary">{Math.round(singlePoint.netWpm)} WPM</span>
            <span>({singlePoint.accuracy.toFixed(1)}% Acc)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete at least 2 sessions to unlock speed and consistency trend visualization.
          </p>
        </div>
      </div>
    );
  }

  // Calculate scales for SVG viewBox (Width 500, Height 160)
  const svgWidth = 500;
  const svgHeight = 160;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const minWpm = Math.max(0, Math.floor(Math.min(...points.map((p) => p.netWpm)) / 10) * 10 - 10);
  const maxWpm = Math.max(minWpm + 30, Math.ceil(Math.max(...points.map((p) => p.netWpm)) / 10) * 10 + 10);
  const wpmRange = maxWpm - minWpm || 1;

  // Calculate coordinates for each point
  const coords = points.map((p, idx) => {
    const x = paddingLeft + (idx / (count - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((p.netWpm - minWpm) / wpmRange) * chartHeight;
    return { x, y, point: p, index: idx };
  });

  // Construct smooth SVG path using cubic bezier curves
  let pathD = `M ${coords[0]!.x} ${coords[0]!.y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i]!;
    const next = coords[i + 1]!;
    const cpX = (curr.x + next.x) / 2;
    pathD += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }

  // Closed area path for gradient
  const areaD = `${pathD} L ${coords[coords.length - 1]!.x} ${paddingTop + chartHeight} L ${coords[0]!.x} ${paddingTop + chartHeight} Z`;

  // Horizontal gridlines (3 reference levels)
  const gridLevels = [
    minWpm,
    Math.round(minWpm + wpmRange / 2),
    maxWpm,
  ];

  const hoveredPoint = hoveredIndex !== null ? coords[hoveredIndex]?.point : null;

  return (
    <div
      className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card text-card-foreground shadow-sm h-full"
      aria-label="Speed and Consistency Trend"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-foreground font-sans">
            Speed & Consistency Trend
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Net WPM progression across last {count} sessions
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            <span>Net WPM</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>&gt; 4 Errors</span>
          </span>
        </div>
      </div>

      {/* Interactive Tooltip Callout */}
      <div className="h-6 text-xs font-mono flex items-center">
        {hoveredPoint ? (
          <div className="flex items-center gap-2 text-foreground animate-in fade-in duration-100">
            <span className="text-primary font-bold">
              {Math.round(hoveredPoint.netWpm)} Net WPM
            </span>
            <span className="text-muted-foreground">
              (Raw: {Math.round(hoveredPoint.grossWpm)} WPM)
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-emerald-500 font-medium">
              {hoveredPoint.accuracy.toFixed(1)}% Acc
            </span>
            <span className="text-muted-foreground">•</span>
            <span className={hoveredPoint.totalErrors > 4 ? "text-rose-500 font-bold" : "text-muted-foreground"}>
              {hoveredPoint.totalErrors} {hoveredPoint.totalErrors === 1 ? "Error" : "Errors"}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground/60 text-[11px]">
            Hover data points to inspect session telemetry
          </span>
        )}
      </div>

      {/* SVG Curve Canvas */}
      <div className="relative w-full overflow-hidden" role="img" aria-label={`WPM trend curve across ${count} sessions`}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="wpmAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines & Y-Axis Labels */}
          {gridLevels.map((lvl) => {
            const y = paddingTop + chartHeight - ((lvl - minWpm) / wpmRange) * chartHeight;
            return (
              <g key={lvl}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="text-border/60"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-muted-foreground"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Gradient Area Fill */}
          <path d={areaD} fill="url(#wpmAreaGradient)" />

          {/* Electric Cobalt Bezier Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Nodes and Hover Targets */}
          {coords.map((c) => {
            const isErrorSpike = c.point.totalErrors > 4;
            const isHovered = hoveredIndex === c.index;

            return (
              <g
                key={c.point.sessionId || c.index}
                onMouseEnter={() => setHoveredIndex(c.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible large hit area */}
                <circle cx={c.x} cy={c.y} r="10" fill="transparent" />

                {/* Node Dot */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? "5" : isErrorSpike ? "4" : "3"}
                  fill={isErrorSpike ? "#EF4444" : "#2563EB"}
                  stroke={isHovered ? "#FFFFFF" : isErrorSpike ? "#B91C1C" : "#1D4ED8"}
                  strokeWidth={isHovered ? "2" : "1.5"}
                  className="transition-all duration-150"
                />

                {/* X-axis Session Number */}
                <text
                  x={c.x}
                  y={svgHeight - 6}
                  textAnchor="middle"
                  className={`text-[9px] font-mono ${
                    isHovered ? "fill-primary font-bold" : "fill-muted-foreground/70"
                  }`}
                >
                  #{c.index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Screen Reader Table Fallback */}
      <table className="sr-only">
        <caption>Historical Speed and Accuracy Progression Trend</caption>
        <thead>
          <tr>
            <th scope="col">Session</th>
            <th scope="col">Net WPM</th>
            <th scope="col">Gross WPM</th>
            <th scope="col">Accuracy</th>
            <th scope="col">Errors</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, idx) => (
            <tr key={p.sessionId || idx}>
              <td>Session {idx + 1}</td>
              <td>{p.netWpm.toFixed(1)} WPM</td>
              <td>{p.grossWpm.toFixed(1)} WPM</td>
              <td>{p.accuracy.toFixed(1)}%</td>
              <td>{p.totalErrors}</td>
              <td>{p.completedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
