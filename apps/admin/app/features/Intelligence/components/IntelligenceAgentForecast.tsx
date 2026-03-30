"use client";

import React, { type ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyPHP, formatPercent } from "@/app/features/Intelligence/helpers";

type BOTrend = "improving" | "stable" | "worsening";

interface AgentForecastRow {
  id: string;
  name: string;
  initials: string;
  color: string;
  soldLast30Days: number;
  projectedNext7Days: number;
  boTrend: BOTrend;
  sparkline: number[]; // last 7 days relative values 0–1
}

const MOCK_AGENTS: AgentForecastRow[] = [
  {
    id: "1",
    name: "Juan dela Cruz",
    initials: "JC",
    color: "bg-violet-500",
    soldLast30Days: 262_500,
    projectedNext7Days: 63_700,
    boTrend: "improving",
    sparkline: [0.65, 0.70, 0.72, 0.8, 0.88, 0.91, 1.0],
  },
  {
    id: "2",
    name: "Maria Santos",
    initials: "MS",
    color: "bg-sky-500",
    soldLast30Days: 246_000,
    projectedNext7Days: 55_300,
    boTrend: "stable",
    sparkline: [0.95, 0.91, 0.88, 0.82, 0.80, 0.79, 0.74],
  },
  {
    id: "3",
    name: "Roberto Reyes",
    initials: "RR",
    color: "bg-emerald-500",
    soldLast30Days: 309_000,
    projectedNext7Days: 75_600,
    boTrend: "improving",
    sparkline: [0.7, 0.74, 0.78, 0.83, 0.88, 0.94, 1.0],
  },
  {
    id: "4",
    name: "Ana Lim",
    initials: "AL",
    color: "bg-rose-500",
    soldLast30Days: 213_000,
    projectedNext7Days: 40_600,
    boTrend: "worsening",
    sparkline: [1.0, 0.91, 0.88, 0.74, 0.66, 0.62, 0.52],
  },
  {
    id: "5",
    name: "Carlo Bautista",
    initials: "CB",
    color: "bg-amber-500",
    soldLast30Days: 195_000,
    projectedNext7Days: 44_940,
    boTrend: "stable",
    sparkline: [0.88, 0.90, 0.92, 0.94, 0.91, 0.93, 0.95],
  },
];

const boTrendConfig: Record<BOTrend, { label: string; variant: "success" | "pending" | "warning" }> = {
  improving: { label: "Improving", variant: "success" },
  stable:    { label: "Stable",    variant: "pending"  },
  worsening: { label: "Worsening", variant: "warning"  },
};

// Compares projected next 7 days daily avg vs 30-day daily avg
function DeltaChip({ sold30d, projected7d }: { sold30d: number; projected7d: number }): ReactElement {
  const avg30 = sold30d / 30;
  const avg7 = projected7d / 7;
  const pct = avg30 > 0 ? ((avg7 - avg30) / avg30) * 100 : 0;
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}
    >
      {up ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function MiniLineChart({ values, agentName }: { values: number[]; agentName: string }): ReactElement {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const W = 140;
  const H = 20;
  const pad = 2;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (W - pad * 2),
    y: H - pad - ((v - min) / range) * (H - pad * 2),
    v,
  }));

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");

  const trend = values[values.length - 1]! - values[0]!;
  const stroke = trend >= 0.05 ? "#10b981" : trend <= -0.1 ? "#f43f5e" : "#f59e0b";

  const gradId = `fill-${agentName.replace(/\s+/g, "")}`;

  // Tooltip positioning
  const tip = hovered !== null ? coords[hovered] : null;
  const tipLabel = hovered !== null ? `Day ${hovered + 1}: ${(values[hovered]! * 100).toFixed(0)}%` : "";
  const tipW = 72;
  const tipX = tip ? Math.min(Math.max(tip.x - tipW / 2, 0), W - tipW) : 0;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="shrink-0 overflow-visible"
      onMouseLeave={() => setHovered(null)}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <polygon
        points={`${pad},${H} ${polylinePoints} ${W - pad},${H}`}
        fill={`url(#${gradId})`}
      />

      {/* Line */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Hover hit areas + dots */}
      {coords.map((c, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)}>
          <circle
            cx={c.x}
            cy={c.y}
            r={8}
            fill="transparent"
          />
          <circle
            cx={c.x}
            cy={c.y}
            r={hovered === i ? 3 : i === coords.length - 1 ? 2.5 : 0}
            fill={stroke}
            className="transition-all"
          />
        </g>
      ))}

      {/* Vertical hover line */}
      {tip && (
        <line
          x1={tip.x} y1={0}
          x2={tip.x} y2={H}
          stroke={stroke}
          strokeWidth={1}
          strokeDasharray="3 2"
          opacity={0.5}
        />
      )}

      {/* Tooltip bubble */}
      {tip && (
        <g>
          <rect
            x={tipX}
            y={-22}
            width={tipW}
            height={16}
            rx={4}
            fill="#1e293b"
            opacity={0.9}
          />
          <text
            x={tipX + tipW / 2}
            y={-11}
            textAnchor="middle"
            fontSize={9}
            fill="#f8fafc"
            fontFamily="sans-serif"
          >
            {tipLabel}
          </text>
        </g>
      )}
    </svg>
  );
}

export function IntelligenceAgentForecast(): ReactElement {
  const sorted = [...MOCK_AGENTS].sort((a, b) => b.projectedNext7Days - a.projectedNext7Days);

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Agent performance forecast</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              30-day revenue vs projected next 7 days · sorted by projected revenue
            </p>
          </div>
          <Badge variant="pending" className="text-xs">Mock data</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 border-b px-5 py-2 text-xs font-medium text-muted-foreground">
          <span>Agent</span>
          <span className="w-32 text-right">Sold (past 30 days)</span>
          <span className="w-36 text-right">Projected next 7 days</span>
          <span className="w-24 text-right">BO trend</span>
        </div>

        <div className="divide-y">
          {sorted.map((agent, idx) => {
            const trend = boTrendConfig[agent.boTrend];

            return (
              <div
                key={agent.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 px-5 py-3 hover:bg-muted/40 transition-colors"
              >
                {/* Agent info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${agent.color}`}>
                    {agent.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{agent.name}</p>
                      {idx === 0 && (
                        <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Top</span>
                      )}
                    </div>
                    <div className="mt-1">
                      <MiniLineChart values={agent.sparkline} agentName={agent.name} />
                    </div>
                  </div>
                </div>

                {/* Sold past 30 days */}
                <div className="w-32 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrencyPHP(agent.soldLast30Days)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrencyPHP(Math.round(agent.soldLast30Days / 30))} / day avg
                  </p>
                </div>

                {/* Projected next 7 days */}
                <div className="w-36 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrencyPHP(agent.projectedNext7Days)}
                  </p>
                  <DeltaChip sold30d={agent.soldLast30Days} projected7d={agent.projectedNext7Days} />
                </div>

                {/* BO trend */}
                <div className="w-24 flex justify-end">
                  <Badge variant={trend.variant}>{trend.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary footer */}
        <div className="border-t px-5 py-3 flex items-center justify-between bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {MOCK_AGENTS.filter(a => a.boTrend === "worsening").length} agent{MOCK_AGENTS.filter(a => a.boTrend === "worsening").length !== 1 ? "s" : ""} with worsening BO trend
          </p>
          <p className="text-xs text-muted-foreground">
            Total projected (7d): <span className="font-semibold text-foreground">
              {formatCurrencyPHP(MOCK_AGENTS.reduce((s, a) => s + a.projectedNext7Days, 0))}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
