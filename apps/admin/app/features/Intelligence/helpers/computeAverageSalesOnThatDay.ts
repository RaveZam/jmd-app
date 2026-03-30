export function computeAverageSalesOnThatDay(data: any) {
  const dayToday = new Date().getDay();

  const salesThatDay = data.filter((r: any) => {
    const rawDate = r.createdAt.split("T")[0];
    return new Date(rawDate).getDay() === dayToday + 1;
  });

  const totalSalesThatDay = salesThatDay?.reduce(
    (sum: number, r: any) => r.total + sum,
    0,
  );

  const howManyDaysOfThatDayInAMonth = new Set(
    salesThatDay?.map((r: any) => r.createdAt.split("T")[0]),
  ).size;

  console.log("size", howManyDaysOfThatDayInAMonth);
  const predictedRevenueForTomorrow =
    totalSalesThatDay / howManyDaysOfThatDayInAMonth;
  return {
    predictedRevenueForTomorrow,
    dayToday,
  };
}
