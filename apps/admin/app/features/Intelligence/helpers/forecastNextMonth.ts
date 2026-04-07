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

function getWeekOfMonth(day: number): number {
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
}
function getWeekStart(date: Date): Date {
  const day = date.getDate();
  let weekStart: number;
  if (day <= 7) weekStart = 1;
  else if (day <= 14) weekStart = 8;
  else if (day <= 21) weekStart = 15;
  else weekStart = 22;
  return new Date(date.getFullYear(), date.getMonth(), weekStart);
}

function phNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 8 * 60 * 60 * 1000);
}

export function forecastNextMonth(yearData: yearData[]): ForecastChartData {
  const weeklyDateForThePastYear: { label: string; actual: number }[] = [];
  const nextMonthForecastData: DataPoint[] = [];
  const offsetDate = phNow();
  offsetDate.setDate(offsetDate.getDate() - 31);
  const startingDate = getWeekStart(offsetDate);
  const now = phNow();
  const cutoffDate = getWeekStart(now);
  const cutoffMonth = cutoffDate.getMonth();
  const nextMonthName = MONTH_NAMES[cutoffMonth];

  for (const record of yearData ?? []) {
    const date = new Date(record.sale_date.split("T")[0]);
    const day = date.getDate();
    const monthIdx = date.getMonth();
    const monthLabel = MONTH_NAMES[monthIdx];
    const week = getWeekOfMonth(day);
    const label = `${monthLabel} W${week}`;

    if (date < cutoffDate) {
      const existing = weeklyDateForThePastYear.find((w) => w.label === label);
      if (existing) {
        existing.actual += record.total_sales;
      } else {
        weeklyDateForThePastYear.push({ label, actual: record.total_sales });
      }
    }

    if (startingDate < date && date < cutoffDate) {
      const chartExisting = nextMonthForecastData.find(
        (w) => w.label === label,
      );
      if (chartExisting && chartExisting.actual) {
        chartExisting.actual += record.total_sales;
      } else {
        nextMonthForecastData.push({ label, actual: record.total_sales });
      }
    }
  }

  const points = weeklyDateForThePastYear.map((d, i) => [i, d.actual]);
  console.log(weeklyDateForThePastYear);
  const reg = ss.linearRegression(points);
  const line = ss.linearRegressionLine(reg);

  console.log(reg);
  console.log("points", JSON.stringify(points));
  console.log("length", points.length);

  //display the last 4 weeks sa forecast
  const nextWeekStartIndex = weeklyDateForThePastYear.length;
  for (let i = 0; i < 4; i++) {
    nextMonthForecastData.push({
      label: `${nextMonthName} W${i + 1}`,
      forecast: Math.round(line(nextWeekStartIndex + i)),
    });
  }

  return {
    title: "Next Month Revenue Forecast",
    forecastStart: "...",
    forecastEnd: "...",
    yFormatter: (v) => `₱${(v / 1000).toFixed(0)}k`,
    data: nextMonthForecastData.sort(
      (a, b) =>
        MONTH_NAMES.indexOf(a.label.split(" ")[0]) -
          MONTH_NAMES.indexOf(b.label.split(" ")[0]) ||
        a.label.localeCompare(b.label),
    ),
  };
}
