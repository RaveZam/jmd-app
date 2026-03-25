"use client";

import type { ReactElement } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockData = [
  { product: "Pandesal", sold: 312, bo: 28 },
  { product: "Ensaymada", sold: 204, bo: 41 },
  { product: "Monay", sold: 178, bo: 19 },
  { product: "Cheese Roll", sold: 156, bo: 33 },
  { product: "Hopia", sold: 98, bo: 52 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}): ReactElement | null {
  if (!active || !payload?.length) return null;
  const sold = payload.find((p) => p.name === "Sold")?.value ?? 0;
  const bo = payload.find((p) => p.name === "BO")?.value ?? 0;
  const boRate = sold + bo > 0 ? ((bo / (sold + bo)) * 100).toFixed(1) : "0";
  return (
    <div
      style={{
        fontSize: 12,
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        background: "#fff",
        padding: "8px 12px",
        minWidth: 140,
      }}
    >
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold text-foreground">{p.value} pcs</span>
        </p>
      ))}
      <p className="mt-1 text-muted-foreground">
        BO Rate: <span className="font-semibold text-foreground">{boRate}%</span>
      </p>
    </div>
  );
}

export function ProductSoldVsBoChart(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Sold vs. BO by Product</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={mockData}
            margin={{ top: 0, right: 4, left: -12, bottom: 0 }}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="product"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Bar dataKey="sold" name="Sold" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} />
            <Bar dataKey="bo" name="BO" fill="#f87171" radius={[3, 3, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
