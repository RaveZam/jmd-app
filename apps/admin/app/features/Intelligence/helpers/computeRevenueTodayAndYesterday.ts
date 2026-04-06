export function computeRevenueTodayAndYesterday(data: any) {
  const now = new Date();
  const phTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const today = phTime.toISOString().split("T")[0];

  const yesterdayPh = new Date(now.getTime() + 8 * 60 * 60 * 1000 - 86400000);
  const yesterday = yesterdayPh.toISOString().split("T")[0];

  const todayData = data.filter((r: { date: string }) => r.date === today);
  const yesterdayData = data.filter(
    (r: { date: string }) => r.date === yesterday,
  );
  const totalSalesToday = todayData.reduce(
    (sum: number, r: any) => sum + r.total,
    0,
  );

  const totalSalesYesterday = yesterdayData.reduce(
    (sum: number, r: any) => sum + r.total,
    0,
  );
  const percentageDiff =
    totalSalesYesterday === 0
      ? 0
      : ((totalSalesToday - totalSalesYesterday) / totalSalesYesterday) * 100;

  return {
    totalSalesToday,
    totalSalesYesterday,
    percentageDiff,
  };
}
