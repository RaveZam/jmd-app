export function computeMovingAverageAndDayAverage(data: any) {
  let day = 0;
  let averageSalesNextWeek = 0;
  for (day; day < 7; day++) {
    const salesThatDay = data.filter((r: any) => {
      const rawDate = r.createdAt.split("T")[0];
      return new Date(rawDate).getDay() === day;
    });

    const howManyDaysOfThatDayInAMonth = new Set(
      salesThatDay?.map((r: any) => r.createdAt.split("T")[0]),
    ).size;

    const totalSalesThatDay = salesThatDay?.reduce(
      (sum: number, r: any) => r.total + sum,
      0,
    );

    const averageWeeklySaleOfTheDay =
      totalSalesThatDay / (howManyDaysOfThatDayInAMonth || 1);

    averageSalesNextWeek += averageWeeklySaleOfTheDay;
  }

  return {
    averageSalesNextWeek,
  };
}
