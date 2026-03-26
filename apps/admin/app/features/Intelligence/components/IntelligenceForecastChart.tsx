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
import type { DashboardSnapshot } from "@/lib/intelligence/types";
import { buildForecast } from "@/lib/intelligence/forecast";

function formatCurrencyPHP(value: number): string {
  return `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

type ChartDatum = { date: string; actual?: number; forecast?: number; label: string };

export function IntelligenceForecastChart({ snapshot }: { snapshot: DashboardSnapshot }): ReactElement {
  const forecast = buildForecast(snapshot, 7, 7);
  const actualData = snapshot.history.map((h) => ({
    date: h.date,
    actual: h.revenue,
    forecast: undefined,
    label: h.date,
  }));
  const forecastData: ChartDatum[] = forecast.map((f) => ({
    date: f.date,
    actual: undefined,
    forecast: f.revenue,
    label: f.date,
  }));
  const combined = [...actualData, ...forecastData];

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">7-day revenue forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combined} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" vertical={true} horizontal={true} />
              {forecastData.length > 0 && (
                <ReferenceArea
                  x1={forecastData[0].label}
                  x2={forecastData[forecastData.length - 1].label}
                  fill="rgb(148,163,184)"
                  fillOpacity={0.12}
                  strokeOpacity={0}
                />
              )}
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
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
