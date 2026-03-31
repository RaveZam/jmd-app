import { ForecastChartData } from "../types/forecast_types";

export function forecastNextMonth(data: any): ForecastChartData {
  return {
    title: "Next month revenue forecast",
    forecastStart: "Apr W1",
    forecastEnd: "Apr W4",
    yFormatter: (v) => `₱${(v / 1000).toFixed(0)}k`,
    data: [
      { label: "Mar W1", actual: 310000 },
      { label: "Mar W2", actual: 295000 },
      { label: "Mar W3", actual: 328000 },
      { label: "Mar W4", actual: 340000 },
      { label: "Apr W1", forecast: 330000 },
      { label: "Apr W2", forecast: 345000 },
      { label: "Apr W3", forecast: 355000 },
      { label: "Apr W4", forecast: 360000 },
    ],
  };
}
