"use client";

import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from "recharts";

const HARDCODED_DATA = [
  { date: "Mar 20", varianceQty: 3, boRatePct: 6 },
  { date: "Mar 21", varianceQty: 7, boRatePct: 9 },
  { date: "Mar 22", varianceQty: 2, boRatePct: 5 },
  { date: "Mar 23", varianceQty: 5, boRatePct: 11 },
  { date: "Mar 24", varianceQty: 8, boRatePct: 14 },
  { date: "Mar 25", varianceQty: 4, boRatePct: 8 },
  { date: "Mar 26", varianceQty: 6, boRatePct: 10 },
];

export function IntelligenceRiskChart(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">BO / variance by day</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={HARDCODED_DATA} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(value: number, name: string) =>
                  [name === "boRatePct" ? `${value}%` : value, name === "boRatePct" ? "BO rate" : "Variance"]
                }
                labelFormatter={(label) => String(label)}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="varianceQty" name="Variance (pcs)" fill="rgb(245, 158, 11)" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="boRatePct" name="BO rate %" stroke="rgb(100, 116, 139)" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
