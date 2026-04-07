import { ForecastChartData, ForecastRange } from "../types/forecast_types";
import { forecastNextWeek } from "../helpers/forecastNextWeek";
import { forecastNextMonth } from "../helpers/forecastNextMonth";
import { forecastNextYear } from "../helpers/forecastNextYear";

export function useGetForecastChart(
  data: any,
  yearData: any,
  allTimeData: any,
) {
  function getForecastData(range: ForecastRange): ForecastChartData {
    if (range === "monthly") return forecastNextMonth(yearData);
    if (range === "yearly") return forecastNextYear(allTimeData);
    return forecastNextWeek(data);
  }
  return { getForecastData };
}
