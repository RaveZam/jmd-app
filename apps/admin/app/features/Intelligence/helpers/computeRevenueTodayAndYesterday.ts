export function computeRevenueTodayAndYesterday(data: any) {
  const today = new Date().toISOString().split("T")[0];
  ("2026-03-30");
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

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
    ((totalSalesToday - totalSalesYesterday) / totalSalesYesterday) * 100;

  return {
    totalSalesToday,
    totalSalesYesterday,
    percentageDiff,
  };
}
