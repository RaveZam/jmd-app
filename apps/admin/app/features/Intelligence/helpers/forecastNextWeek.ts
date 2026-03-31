import { DataPoint, ForecastChartData } from "../types/forecast_types";

export function forecastNextWeek(data: any[]): ForecastChartData {
  let dayOffset = 0;
  const sevenDayForecastData: DataPoint[] = [];

  for (dayOffset; dayOffset < 7; dayOffset++) {
    const dateToFind = new Date();
    dateToFind.setDate(dateToFind.getDate() - dayOffset);
    const dateToFindStr = dateToFind.toISOString().split("T")[0];

    const SalesThatDate = data.filter((item) => {
      const rawDate = item.createdAt.split("T")[0];
      const saleDate = new Date(rawDate);
      const saleDateStr = saleDate.toISOString().split("T")[0];
      return saleDateStr === dateToFindStr;
    });

    const totalSalesThatDay = SalesThatDate.reduce(
      (sum: number, r: any) => r.total + sum,
      0,
    );

    sevenDayForecastData.push({
      label: dateToFindStr,
      actual: totalSalesThatDay,
    });
  }

  return {
    title: "7-day revenue forecast",
    forecastStart: "...",
    forecastEnd: "...",
    yFormatter: (v) => `₱${(v / 1000).toFixed(0)}k`,
    data: sevenDayForecastData.reverse(),
  };
}
