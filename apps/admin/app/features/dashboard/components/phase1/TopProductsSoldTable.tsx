"use client";

import type { ReactElement } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockData = [
  { name: "Pandesal (12pc)", qty: 120, value: 6600 },
  { name: "Ensaymada", qty: 90, value: 3150 },
  { name: "Spanish Bread", qty: 75, value: 2250 },
  { name: "Cheese Bread", qty: 60, value: 2400 },
  { name: "Brownies (4pc)", qty: 40, value: 3800 },
];

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"];

function formatCurrencyPHP(value: number): string {
  return `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function TopProductsSoldTable(): ReactElement {
  const totalQty = mockData.reduce((sum, d) => sum + d.qty, 0);

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top 5 Products Sold</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <ResponsiveContainer width={200} height={220}>
              <PieChart>
                <Pie
                  data={mockData}
                  dataKey="qty"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {mockData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} qty`, name]}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {mockData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="flex-1 truncate text-xs">{d.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {((d.qty / totalQty) * 100).toFixed(0)}%
                </span>
                <span className="text-xs tabular-nums font-medium">
                  {formatCurrencyPHP(d.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
