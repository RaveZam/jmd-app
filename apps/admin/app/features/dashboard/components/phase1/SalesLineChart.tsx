"use client";

import type { ReactElement } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterRange } from "../../types";

function formatCurrencyPHP(value: number): string {
  if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `₱${(value / 1000).toFixed(1)}k`;
  return `₱${value}`;
}

function formatXLabel(dateStr: string, filter: FilterRange): string {
  const date = new Date(dateStr);
  if (filter === "30days") {
    return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-PH", { weekday: "short" });
}

const CHART_TITLE: Record<FilterRange, string> = {
  today: "Sales Today",
  "7days": "Sales — Last 7 Days",
  "30days": "Sales — Last 30 Days",
};

export function SalesLineChart({
  data,
  filter,
}: {
  data: any[];
  filter: FilterRange;
}): ReactElement {
  const salesByDate: Record<string, number> = {};
  for (const row of data) {
    salesByDate[row.date] = (salesByDate[row.date] ?? 0) + row.total;
  }

  const chartData = Object.keys(salesByDate)
    .sort()
    .map((date) => ({
      label: formatXLabel(date, filter),
      sales: salesByDate[date],
    }));

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{CHART_TITLE[filter]}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrencyPHP}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrencyPHP(value), "Sales"]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              cursor={{
                stroke: "#10b981",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#salesGradient)"
              dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#059669", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
