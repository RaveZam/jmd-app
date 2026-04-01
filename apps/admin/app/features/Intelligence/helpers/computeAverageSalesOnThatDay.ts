function phNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 8 * 60 * 60 * 1000);
}

export function computeAverageSalesOnThatDay(data: any) {
  const dayToday = phNow().getDay();

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

  const predictedRevenueForTomorrow =
    totalSalesThatDay / howManyDaysOfThatDayInAMonth;

  return {
    predictedRevenueForTomorrow,
    dayToday,
  };
}
