"use client";

import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DashboardSnapshot, ForecastDay } from "@/lib/intelligence/types";
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
      <CardContent className="space-y-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combined} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => [formatCurrencyPHP(value), ""]}
                labelFormatter={(label) => label}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="rgb(16, 185, 129)"
                strokeWidth={2}
                dot={{ r: 3 }}
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
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Day</th>
                <th className="px-3 py-2 text-right font-medium">Forecasted revenue</th>
                <th className="px-3 py-2 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((row) => (
                <tr key={row.date} className="border-b last:border-0">
                  <td className="px-3 py-2">{row.date}</td>
                  <td className="px-3 py-2 text-right">{formatCurrencyPHP(row.revenue)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
