import { ForecastChartData } from "../types/forecast_types";

export function forecastNextYear(data: any[]): ForecastChartData {
  return {
    title: "Next year revenue forecast",
    forecastStart: "Apr",
    forecastEnd: "Dec",
    yFormatter: (v) => `₱${(v / 1000000).toFixed(1)}M`,
    data: [
      { label: "Oct", actual: 1200000 },
      { label: "Nov", actual: 1350000 },
      { label: "Dec", actual: 1520000 },
      { label: "Jan", actual: 1180000 },
      { label: "Feb", actual: 1240000 },
      { label: "Mar", actual: 1310000 },
      { label: "Apr", forecast: 1360000 },
      { label: "May", forecast: 1400000 },
      { label: "Jun", forecast: 1380000 },
      { label: "Jul", forecast: 1420000 },
      { label: "Aug", forecast: 1450000 },
      { label: "Sep", forecast: 1490000 },
      { label: "Oct", forecast: 1530000 },
      { label: "Nov", forecast: 1580000 },
      { label: "Dec", forecast: 1650000 },
    ],
  };
}
