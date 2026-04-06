import { ForecastChartData, DataPoint } from "../types/forecast_types";
import * as ss from "simple-statistics";

type yearData = { sale_date: string; total_sales: number; order_count: number };

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function phNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 8 * 60 * 60 * 1000);
}

export function forecastNextMonth(yearData: yearData[]): ForecastChartData {
  const now = phNow();
  const currentMonth = now.getMonth();

  // Aggregate sales by month index (0–11)
  const monthlyTotals = new Map<number, number>();
  const weekLabels = new Set<string>();

  for (const record of yearData ?? []) {
    const date = new Date(record.sale_date.split("T")[0]);
    const monthIdx = date.getMonth();
    monthlyTotals.set(
      monthIdx,
      (monthlyTotals.get(monthIdx) ?? 0) + record.total_sales,
    );

    // Track unique week labels for data volume check
    const day = date.getDate();
    const week = day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4;
    weekLabels.add(`${date.getFullYear()}-${monthIdx}-W${week}`);
  }

  const totalWeeks = weekLabels.size;

  if (totalWeeks >= 104) {
    // TODO: implement more sophisticated forecasting (e.g., seasonal decomposition)
    // Fall through to linear regression for now
  }

  // Build regression points from months that have actual data
  const points: [number, number][] = [];
  for (const [monthIdx, total] of monthlyTotals) {
    points.push([monthIdx, total]);
  }
  points.sort((a, b) => a[0] - b[0]);

  const reg = ss.linearRegression(points);
  const line = ss.linearRegressionLine(reg);

  // Build output: actuals for past months, forecasts from current month onward
  const data: DataPoint[] = [];
  let forecastStart = "";
  let forecastEnd = "";

  for (let m = 0; m < 12; m++) {
    const label = MONTH_NAMES[m];

    if (m < currentMonth && monthlyTotals.has(m)) {
      data.push({ label, actual: monthlyTotals.get(m)! });
    } else if (m >= currentMonth) {
      const projected = Math.max(0, Math.round(line(m)));
      data.push({ label, forecast: projected });
      if (!forecastStart) forecastStart = label;
      forecastEnd = label;
    }
  }

  return {
    title: "Yearly Revenue Forecast",
    forecastStart,
    forecastEnd,
    yFormatter: (v) => `₱${(v / 1000).toFixed(0)}k`,
    data,
  };
}
