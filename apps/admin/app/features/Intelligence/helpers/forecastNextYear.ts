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

export function forecastNextYear(allTimeData: yearData[]): ForecastChartData {
  const forecastYearData: DataPoint[] = [];
  const allTimeMonthlyData: { label: string; actual: number }[] = [];
  const now = phNow();
  const yearNow = now.getFullYear();
  const monthNow = now.getMonth();

  for (const record of allTimeData ?? []) {
    const dateOfRecord = record.sale_date;
    const date = new Date(dateOfRecord);
    const monthOfRecord = date.getMonth();
    const yearOfRecord = date.getFullYear();

    const existing = allTimeMonthlyData.find(
      (y) => y.label === MONTH_NAMES[monthOfRecord] + yearOfRecord,
    );

    if (existing && existing.actual) {
      existing.actual += record.total_sales;
    } else {
      if (monthOfRecord !== monthNow || yearOfRecord !== yearNow) {
        allTimeMonthlyData.push({
          label: MONTH_NAMES[monthOfRecord] + yearOfRecord,
          actual: record.total_sales,
        });
      }
    }
  }

  console.log(allTimeMonthlyData);

  const thisYearData = allTimeData?.filter((record: any) => {
    const dateOfRecord = record.sale_date;
    const date = new Date(dateOfRecord);
    const yearOfRecord = date.getFullYear();

    return yearOfRecord === yearNow;
  });

  for (const record of thisYearData ?? []) {
    const date = new Date(record.sale_date);
    const monthOfRecord = date.getMonth();

    const existing = forecastYearData.find(
      (y) => y.label === MONTH_NAMES[monthOfRecord],
    );

    if (existing && existing.actual) {
      existing.actual += record.total_sales;
    } else {
      if (monthOfRecord !== monthNow || date.getFullYear() !== yearNow) {
        forecastYearData.push({
          label: MONTH_NAMES[monthOfRecord],
          actual: record.total_sales,
        });
      }
    }
  }

  const points = allTimeMonthlyData.map((d, i) => [i, d.actual]);
  const reg = ss.linearRegression(points);
  const line = ss.linearRegressionLine(reg);

  const monthsWithData = forecastYearData.length;
  const monthsToForecast = 12 - monthsWithData;

  for (let i = 0; i < monthsToForecast; i++) {
    const forecastMonthIndex = monthsWithData + i;
    forecastYearData.push({
      label: MONTH_NAMES[forecastMonthIndex],
      forecast: Math.round(line(points.length + i)),
    });
  }

  return {
    title: "Yearly Revenue Forecast",
    forecastStart: "...",
    forecastEnd: "...",
    yFormatter: (v) => `₱${(v / 1000).toFixed(0)}k`,
    data: forecastYearData,
  };
}
