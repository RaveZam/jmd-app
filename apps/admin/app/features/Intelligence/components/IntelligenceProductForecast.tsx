"use client";

import React, { type ReactElement, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BOTrend = "improving" | "stable" | "worsening";
type ProductStatus = "hot" | "stable" | "declining" | "high_spoilage";

interface ProductForecastRow {
  id: string;
  name: string;
  emoji: string;
  soldSparkline: number[];
  boSparkline: number[];
  soldLast30Days: number;
  projectedNext7Days: number;
  boTrend: BOTrend;
  status: ProductStatus;
}

const MOCK_PRODUCTS: ProductForecastRow[] = [
  {
    id: "1",
    name: "Pandesal",
    emoji: "🍞",
    soldSparkline: [0.72, 0.75, 0.78, 0.83, 0.88, 0.93, 1.0],
    boSparkline: [0.3, 0.28, 0.25, 0.22, 0.18, 0.15, 0.1],
    soldLast30Days: 11_400,
    projectedNext7Days: 3_045,
    boTrend: "improving",
    status: "hot",
  },
  {
    id: "2",
    name: "Spanish Bread",
    emoji: "🥖",
    soldSparkline: [0.9, 0.88, 0.85, 0.82, 0.78, 0.75, 0.68],
    boSparkline: [0.2, 0.26, 0.32, 0.38, 0.44, 0.52, 0.6],
    soldLast30Days: 7_800,
    projectedNext7Days: 1_470,
    boTrend: "worsening",
    status: "declining",
  },
  {
    id: "3",
    name: "Ensaymada",
    emoji: "🧁",
    soldSparkline: [0.55, 0.58, 0.6, 0.57, 0.59, 0.62, 0.59],
    boSparkline: [0.4, 0.41, 0.38, 0.42, 0.4, 0.39, 0.41],
    soldLast30Days: 2_700,
    projectedNext7Days: 623,
    boTrend: "stable",
    status: "high_spoilage",
  },
  {
    id: "4",
    name: "Tasty Bread",
    emoji: "🍞",
    soldSparkline: [0.8, 0.81, 0.82, 0.79, 0.83, 0.82, 0.81],
    boSparkline: [0.15, 0.16, 0.18, 0.14, 0.16, 0.17, 0.15],
    soldLast30Days: 9_150,
    projectedNext7Days: 2_156,
    boTrend: "stable",
    status: "stable",
  },
  {
    id: "5",
    name: "Cheese Roll",
    emoji: "🥐",
    soldSparkline: [1.0, 0.88, 0.8, 0.75, 0.63, 0.57, 0.5],
    boSparkline: [0.1, 0.2, 0.3, 0.42, 0.55, 0.65, 0.75],
    soldLast30Days: 3_450,
    projectedNext7Days: 525,
    boTrend: "worsening",
    status: "high_spoilage",
  },
  {
    id: "6",
    name: "Monay",
    emoji: "🫓",
    soldSparkline: [0.65, 0.68, 0.7, 0.74, 0.77, 0.8, 0.82],
    boSparkline: [0.35, 0.32, 0.3, 0.27, 0.24, 0.21, 0.18],
    soldLast30Days: 3_900,
    projectedNext7Days: 1_064,
    boTrend: "improving",
    status: "hot",
  },
];

const statusConfig: Record<
  ProductStatus,
  {
    label: string;
    variant: "success" | "warning" | "pending" | "default";
    desc: string;
  }
> = {
  hot: {
    label: "Trending Up",
    variant: "success",
    desc: "Sales rising consistently",
  },
  stable: {
    label: "Stable",
    variant: "pending",
    desc: "Consistent sell-through",
  },
  declining: {
    label: "Declining",
    variant: "default",
    desc: "Sales dropping over period",
  },
  high_spoilage: {
    label: "High Spoilage",
    variant: "warning",
    desc: "BO rate needs attention",
  },
};

const boTrendConfig: Record<
  BOTrend,
  { label: string; variant: "success" | "pending" | "warning" }
> = {
  improving: { label: "Improving", variant: "success" },
  stable: { label: "Stable", variant: "pending" },
  worsening: { label: "Worsening", variant: "warning" },
};

type SortKey = "sold" | "bo" | "projected";

function MiniSparkline({
  values,
  id,
  color,
  label,
}: {
  values: number[];
  id: string;
  color: string;
  label: string;
}): ReactElement {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const W = 100;
  const H = 22;
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
  const gradId = `grad-${id}`;
  const tip = hovered !== null ? coords[hovered] : null;
  const tipW = 80;
  const tipX = tip ? Math.min(Math.max(tip.x - tipW / 2, 0), W - tipW) : 0;

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-muted-foreground font-medium">
        {label}
      </span>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="overflow-visible"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon
          points={`${pad},${H} ${polylinePoints} ${W - pad},${H}`}
          fill={`url(#${gradId})`}
        />
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coords.map((c, i) => (
          <g key={i} onMouseEnter={() => setHovered(i)}>
            <circle cx={c.x} cy={c.y} r={8} fill="transparent" />
            <circle
              cx={c.x}
              cy={c.y}
              r={hovered === i ? 3 : i === coords.length - 1 ? 2.5 : 0}
              fill={color}
            />
          </g>
        ))}
        {tip && (
          <>
            <line
              x1={tip.x}
              y1={0}
              x2={tip.x}
              y2={H}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="3 2"
              opacity={0.5}
            />
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
              Day {hovered! + 1}: {(tip.v * 100).toFixed(0)}% of peak
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

// Compares projected next 7 days daily avg vs 30-day daily avg
function DeltaChip({
  sold30d,
  projected7d,
}: {
  sold30d: number;
  projected7d: number;
}): ReactElement {
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

export function IntelligenceProductForecast(): ReactElement {
  const [sortBy, setSortBy] = useState<SortKey>("sold");

  const boTrendOrder: Record<BOTrend, number> = {
    worsening: 0,
    stable: 1,
    improving: 2,
  };

  const sorted = [...MOCK_PRODUCTS].sort((a, b) => {
    if (sortBy === "sold") return b.soldLast30Days - a.soldLast30Days;
    if (sortBy === "bo")
      return boTrendOrder[a.boTrend] - boTrendOrder[b.boTrend];
    if (sortBy === "projected")
      return b.projectedNext7Days - a.projectedNext7Days;
    return 0;
  });

  const highSpoilageCount = MOCK_PRODUCTS.filter(
    (p) => p.status === "high_spoilage",
  ).length;
  const decliningCount = MOCK_PRODUCTS.filter(
    (p) => p.status === "declining",
  ).length;
  const hotCount = MOCK_PRODUCTS.filter((p) => p.status === "hot").length;

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">
              Product performance forecast
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              30-day sold qty vs projected next 7 days · identifies spoilage,
              growth, and decline
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="pending" className="text-xs">
              Mock data
            </Badge>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {hotCount} trending up
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {highSpoilageCount} high spoilage
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {decliningCount} declining
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 border-b px-5 py-2 text-xs font-medium text-muted-foreground">
          <span>Product</span>
          <span className="w-[220px]">Trends (Sold · BO)</span>
          <button
            onClick={() => setSortBy("sold")}
            className={`w-32 text-right transition-colors hover:text-foreground ${sortBy === "sold" ? "text-foreground font-semibold" : ""}`}
          >
            Sold (past 30d) {sortBy === "sold" && "↓"}
          </button>
          <button
            onClick={() => setSortBy("projected")}
            className={`w-36 text-right transition-colors hover:text-foreground ${sortBy === "projected" ? "text-foreground font-semibold" : ""}`}
          >
            Projected next 7d {sortBy === "projected" && "↓"}
          </button>
          <button
            onClick={() => setSortBy("bo")}
            className={`w-24 text-right transition-colors hover:text-foreground ${sortBy === "bo" ? "text-foreground font-semibold" : ""}`}
          >
            BO trend {sortBy === "bo" && "↓"}
          </button>
        </div>

        <div className="divide-y">
          {sorted.map((product) => {
            const status = statusConfig[product.status];

            return (
              <div
                key={product.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-4 px-5 py-3 hover:bg-muted/40 transition-colors"
              >
                {/* Product info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                    {product.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {status.desc}
                    </p>
                  </div>
                </div>

                {/* Dual sparklines */}
                <div className="w-[220px] flex items-center gap-4">
                  <MiniSparkline
                    values={product.soldSparkline}
                    id={`sold-${product.id}`}
                    color="#10b981"
                    label="Sold"
                  />
                  <MiniSparkline
                    values={product.boSparkline}
                    id={`bo-${product.id}`}
                    color="#f43f5e"
                    label="BO"
                  />
                </div>

                {/* Sold past 30 days */}
                <div className="w-32 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {product.soldLast30Days.toLocaleString()} pcs
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(product.soldLast30Days / 30)} pcs / day avg
                  </p>
                </div>

                {/* Projected next 7 days */}
                <div className="w-36 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {product.projectedNext7Days.toLocaleString()} pcs
                  </p>
                  <DeltaChip
                    sold30d={product.soldLast30Days}
                    projected7d={product.projectedNext7Days}
                  />
                </div>

                {/* BO trend + status */}
                <div className="w-24 flex flex-col items-end gap-1">
                  <Badge variant={boTrendConfig[product.boTrend].variant}>
                    {boTrendConfig[product.boTrend].label}
                  </Badge>
                  <Badge variant={status.variant} className="text-[10px]">
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-3 flex items-center justify-between bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Sorted by{" "}
            <span className="font-medium text-foreground">
              {sortBy === "sold"
                ? "sold (past 30d)"
                : sortBy === "bo"
                  ? "BO trend"
                  : "projected next 7d"}
            </span>{" "}
            · click column headers to reorder
          </p>
          <p className="text-xs text-muted-foreground">
            Total projected (7d):{" "}
            <span className="font-semibold text-foreground">
              {MOCK_PRODUCTS.reduce(
                (s, p) => s + p.projectedNext7Days,
                0,
              ).toLocaleString()}{" "}
              pcs
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
