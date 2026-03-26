"use client";

import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
} from "recharts";

function formatCurrencyPHP(value: number): string {
  return `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const DATA = [
  { label: "Mar 19", actual: 42000 },
  { label: "Mar 20", actual: 38500 },
  { label: "Mar 21", actual: 51000 },
  { label: "Mar 22", actual: 47000 },
  { label: "Mar 23", actual: 55000 },
  { label: "Mar 24", actual: 49500 },
  { label: "Mar 25", actual: 53000 },
  { label: "Mar 26", forecast: 51000 },
  { label: "Mar 27", forecast: 54000 },
  { label: "Mar 28", forecast: 50000 },
  { label: "Mar 29", forecast: 56000 },
  { label: "Mar 30", forecast: 52000 },
  { label: "Mar 31", forecast: 58000 },
  { label: "Apr 1", forecast: 55000 },
];

export function IntelligenceForecastChart(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">7-day revenue forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={DATA}
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.35)"
                vertical={true}
                horizontal={true}
              />
              <ReferenceArea
                x1="Mar 26"
                x2="Apr 1"
                fill="rgb(148,163,184)"
                fillOpacity={0.12}
                strokeOpacity={0}
              />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrencyPHP(value), ""]}
                labelFormatter={(label) => label}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#actualGradient)"
                dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#059669", strokeWidth: 0 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke="rgb(100, 116, 139)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
