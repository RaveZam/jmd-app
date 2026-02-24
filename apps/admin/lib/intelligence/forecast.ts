import type { DashboardSnapshot, ForecastDay } from "./types";

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function buildForecast(snapshot: DashboardSnapshot, forecastDays = 7, windowDays = 7): ForecastDay[] {
  const h = snapshot.history;
  const revs = h.map((x) => x.revenue);
  const n = Math.min(windowDays, revs.length);
  const window = n > 0 ? revs.slice(-n) : [];
  const avg = window.length ? window.reduce((a, b) => a + b, 0) / window.length : snapshot.totals.revenue;
  const note = `Based on last ${n} days avg`;

  const result: ForecastDay[] = [];
  const startDate = snapshot.date;
  for (let i = 1; i <= forecastDays; i++) {
    result.push({
      date: addDays(startDate, i),
      revenue: Math.round(avg),
      note,
    });
  }
  return result;
}
