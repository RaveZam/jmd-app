import { ForecastChartData, ForecastRange } from "../types/forecast_types";
import { forecastNextWeek } from "../helpers/forecastNextWeek";
import { forecastNextMonth } from "../helpers/forecastNextMonth";
import { forecastNextYear } from "../helpers/forecastNextYear";

export function useGetForecastChart(data: any) {
  function getForecastData(range: ForecastRange): ForecastChartData {
    if (range === "monthly") return forecastNextMonth();
    if (range === "yearly") return forecastNextYear(data);
    return forecastNextWeek(data);
  }
  return { getForecastData };
}
