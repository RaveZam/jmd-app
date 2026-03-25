"use client";

import type { ReactElement } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockAgents = [
  { agent: "Angel", revenue: 48200 },
  { agent: "Marco", revenue: 41500 },
  { agent: "Carla", revenue: 37800 },
  { agent: "Jerome", revenue: 29400 },
  { agent: "Lea", revenue: 22100 },
];

const BAR_COLORS = [
  "#10b981",
  "#34d399",
  "#6ee7b7",
  "#a7f3d0",
  "#d1fae5",
];

function formatCurrencyPHP(value: number): string {
  if (value >= 1000) return `₱${(value / 1000).toFixed(1)}k`;
  return `₱${value}`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { agent: string; revenue: number } }[];
}): ReactElement | null {
  if (!active || !payload?.length) return null;
  const { agent, revenue } = payload[0].payload;
  return (
    <div
      style={{
        fontSize: 12,
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        background: "#fff",
        padding: "6px 10px",
      }}
    >
      <p className="font-medium">{agent}</p>
      <p className="text-muted-foreground">
        Revenue:{" "}
        <span className="font-semibold text-foreground">
          ₱{revenue.toLocaleString()}
        </span>
      </p>
    </div>
  );
}

export function TopAgentsChart(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top Performing Agents</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={mockAgents}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              tickFormatter={formatCurrencyPHP}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="agent"
              width={52}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={18}>
              {mockAgents.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i] ?? "#10b981"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
