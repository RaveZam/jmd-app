"use client";

import React, { type ReactElement, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/app/features/Intelligence/helpers";

type ProductStatus = "hot" | "stable" | "declining" | "high_spoilage";

interface ProductForecastRow {
  id: string;
  name: string;
  emoji: string;
  soldSparkline: number[];   // relative 0–1, last 5 days
  boSparkline: number[];     // relative 0–1, last 5 days
  todaySold: number;
  avgSold: number;
  projectedTomorrow: number;
  todayBoQty: number;
  boRate: number;
  status: ProductStatus;
}

const MOCK_PRODUCTS: ProductForecastRow[] = [
  {
    id: "1",
    name: "Pandesal",
    emoji: "🍞",
    soldSparkline:  [0.72, 0.78, 0.85, 0.93, 1.0],
    boSparkline:    [0.3,  0.25, 0.2,  0.15, 0.1],
    todaySold: 420,
    avgSold: 380,
    projectedTomorrow: 435,
    todayBoQty: 12,
    boRate: 0.03,
    status: "hot",
  },
  {
    id: "2",
    name: "Spanish Bread",
    emoji: "🥖",
    soldSparkline:  [0.9,  0.85, 0.8,  0.75, 0.68],
    boSparkline:    [0.2,  0.3,  0.42, 0.5,  0.6],
    todaySold: 195,
    avgSold: 260,
    projectedTomorrow: 210,
    todayBoQty: 38,
    boRate: 0.16,
    status: "declining",
  },
  {
    id: "3",
    name: "Ensaymada",
    emoji: "🧁",
    soldSparkline:  [0.55, 0.6,  0.58, 0.62, 0.59],
    boSparkline:    [0.4,  0.38, 0.42, 0.39, 0.41],
    todaySold: 88,
    avgSold: 90,
    projectedTomorrow: 89,
    todayBoQty: 22,
    boRate: 0.2,
    status: "high_spoilage",
  },
  {
    id: "4",
    name: "Tasty Bread",
    emoji: "🍞",
    soldSparkline:  [0.8,  0.82, 0.79, 0.83, 0.81],
    boSparkline:    [0.15, 0.18, 0.14, 0.16, 0.15],
    todaySold: 310,
    avgSold: 305,
    projectedTomorrow: 308,
    todayBoQty: 14,
    boRate: 0.04,
    status: "stable",
  },
  {
    id: "5",
    name: "Cheese Roll",
    emoji: "🥐",
    soldSparkline:  [1.0,  0.88, 0.75, 0.63, 0.5],
    boSparkline:    [0.1,  0.25, 0.42, 0.58, 0.75],
    todaySold: 62,
    avgSold: 115,
    projectedTomorrow: 75,
    todayBoQty: 54,
    boRate: 0.47,
    status: "high_spoilage",
  },
  {
    id: "6",
    name: "Monay",
    emoji: "🫓",
    soldSparkline:  [0.65, 0.7,  0.74, 0.78, 0.82],
    boSparkline:    [0.35, 0.3,  0.28, 0.22, 0.18],
    todaySold: 145,
    avgSold: 130,
    projectedTomorrow: 152,
    todayBoQty: 8,
    boRate: 0.05,
    status: "hot",
  },
];

const statusConfig: Record<ProductStatus, { label: string; variant: "success" | "warning" | "pending" | "default"; desc: string }> = {
  hot:           { label: "Trending Up",   variant: "success", desc: "Sales rising consistently"   },
  stable:        { label: "Stable",        variant: "pending", desc: "Consistent sell-through"      },
  declining:     { label: "Declining",     variant: "default", desc: "Sales dropping over period"   },
  high_spoilage: { label: "High Spoilage", variant: "warning", desc: "BO rate needs attention"      },
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
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
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
              x1={tip.x} y1={0} x2={tip.x} y2={H}
              stroke={color} strokeWidth={1} strokeDasharray="3 2" opacity={0.5}
            />
            <rect x={tipX} y={-22} width={tipW} height={16} rx={4} fill="#1e293b" opacity={0.9} />
            <text x={tipX + tipW / 2} y={-11} textAnchor="middle" fontSize={9} fill="#f8fafc" fontFamily="sans-serif">
              Day {hovered! + 1}: {(tip.v * 100).toFixed(0)}% of peak
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

function DeltaChip({ today, projected }: { today: number; projected: number }): ReactElement {
  const pct = today > 0 ? ((projected - today) / today) * 100 : 0;
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
      {up ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

export function IntelligenceProductForecast(): ReactElement {
  const [sortBy, setSortBy] = useState<SortKey>("sold");

  const sorted = [...MOCK_PRODUCTS].sort((a, b) => {
    if (sortBy === "sold")      return b.todaySold - a.todaySold;
    if (sortBy === "bo")        return b.boRate - a.boRate;
    if (sortBy === "projected") return b.projectedTomorrow - a.projectedTomorrow;
    return 0;
  });

  const highSpoilageCount = MOCK_PRODUCTS.filter(p => p.status === "high_spoilage").length;
  const decliningCount    = MOCK_PRODUCTS.filter(p => p.status === "declining").length;
  const hotCount          = MOCK_PRODUCTS.filter(p => p.status === "hot").length;

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">Product performance forecast</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Sold qty and BO trends per product · identifies spoilage, growth, and decline
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="pending" className="text-xs">Mock data</Badge>
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
            className={`w-20 text-right transition-colors hover:text-foreground ${sortBy === "sold" ? "text-foreground font-semibold" : ""}`}
          >
            Today sold {sortBy === "sold" && "↓"}
          </button>
          <button
            onClick={() => setSortBy("projected")}
            className={`w-28 text-right transition-colors hover:text-foreground ${sortBy === "projected" ? "text-foreground font-semibold" : ""}`}
          >
            Projected {sortBy === "projected" && "↓"}
          </button>
          <button
            onClick={() => setSortBy("bo")}
            className={`w-24 text-right transition-colors hover:text-foreground ${sortBy === "bo" ? "text-foreground font-semibold" : ""}`}
          >
            BO rate {sortBy === "bo" && "↓"}
          </button>
        </div>

        <div className="divide-y">
          {sorted.map((product) => {
            const status = statusConfig[product.status];
            const boHigh = product.boRate >= 0.2;

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
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{status.desc}</p>
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

                {/* Today sold */}
                <div className="w-20 text-right">
                  <p className="text-sm font-semibold tabular-nums">{product.todaySold} pcs</p>
                  <p className="text-xs text-muted-foreground">avg {product.avgSold}</p>
                </div>

                {/* Projected tomorrow */}
                <div className="w-28 text-right">
                  <p className="text-sm font-semibold tabular-nums">{product.projectedTomorrow} pcs</p>
                  <DeltaChip today={product.todaySold} projected={product.projectedTomorrow} />
                </div>

                {/* BO rate + status */}
                <div className="w-24 flex flex-col items-end gap-1">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <span className={`text-xs font-medium tabular-nums ${boHigh ? "text-rose-500 dark:text-rose-400" : "text-muted-foreground"}`}>
                    {formatPercent(product.boRate)} BO
                  </span>
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
              {sortBy === "sold" ? "today's sold qty" : sortBy === "bo" ? "BO rate" : "projected tomorrow"}
            </span>
            {" "}· click column headers to reorder
          </p>
          <p className="text-xs text-muted-foreground">
            Total projected:{" "}
            <span className="font-semibold text-foreground">
              {MOCK_PRODUCTS.reduce((s, p) => s + p.projectedTomorrow, 0).toLocaleString()} pcs
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
