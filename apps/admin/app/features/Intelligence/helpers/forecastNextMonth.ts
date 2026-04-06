import { ForecastChartData, DataPoint } from "../types/forecast_types";

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
  const nextMonthForecastData: DataPoint[] = [];
  let month = 1;

  const date = phNow();
  date.setDate(date.getDate() - 28);
  const startingDate = getWeekStart(date);

  for (month; month <= 12; month++) {
    for (const record of yearData) {
      const recordDate = record.sale_date;
      const date = new Date(recordDate.split("T")[0]);
      const day = new Date(record.sale_date).getDate();

      if (startingDate < date) {
        if (date.getMonth() === month) {
          const monthLabel = MONTH_NAMES[month];
          const week = getWeekOfMonth(day);
          const label = `${monthLabel} W${week}`;

          const existing = nextMonthForecastData.find((w) => w.label === label);

          if (existing) {
            if (existing.actual) existing.actual += record.total_sales;
          } else {
            nextMonthForecastData.push({ label, actual: record.total_sales });
          }
        }
      }
    }
    console.log(nextMonthForecastData);
  }

  const firstForecastLabel = "test";
  const lastLabel = "last";

  return {
    title: "This month's revenue by week",
    forecastStart: firstForecastLabel,
    forecastEnd: lastLabel,
    yFormatter: (v) => `₱${(v / 1000).toFixed(0)}k`,
    data: nextMonthForecastData,
  };
}
