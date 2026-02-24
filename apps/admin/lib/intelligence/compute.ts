import { parseAdminFilters } from "@/lib/selectors/filters";
import { getDashboardSnapshot } from "@/lib/intelligence/snapshot";
import { runInsightRules } from "@/lib/intelligence/rules";

type SearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>;

export async function buildIntelligenceContext(searchParams: SearchParams, records: any) {
  const sp = await searchParams;
  const filters = parseAdminFilters(sp);
  const rawRange = Array.isArray(sp.range) ? sp.range[0] : sp.range;
  const rangeDays = rawRange === "30" ? 30 : 7;

  const snapshot = getDashboardSnapshot(records, {
    endDate: filters.date,
    rangeDays,
  });

  const actions = runInsightRules(snapshot);
  const p0Count = actions.filter((a: any) => a.priority === "P0").length;

  const last7 = snapshot.history.slice(-7);
  const avgRevenue = last7.length
    ? last7.reduce((s: number, h: any) => s + h.revenue, 0) / last7.length
    : 0;
  const avgVariance = last7.length
    ? last7.reduce((s: number, h: any) => s + h.varianceQty, 0) / last7.length
    : 0;

  const prevPeriodRevenue =
    snapshot.history.length >= 2 ? snapshot.history[snapshot.history.length - 2]!.revenue : avgRevenue;

  const revenueTrendPct =
    prevPeriodRevenue > 0 ? ((snapshot.totals.revenue - prevPeriodRevenue) / prevPeriodRevenue) * 100 : 0;

  function getBORiskLevel(boRate: number): "Low" | "Med" | "High" {
    if (boRate < 0.1) return "Low";
    if (boRate < 0.2) return "Med";
    return "High";
  }

  function getVarianceRiskLevel(varianceQty: number, avgVariance: number): "Low" | "Med" | "High" {
    const threshold = Math.max(5, avgVariance * 1.5);
    if (varianceQty <= 0) return "Low";
    if (varianceQty <= threshold) return "Med";
    return "High";
  }

  const boRisk = getBORiskLevel(snapshot.totals.boRate);
  const varianceRisk = getVarianceRiskLevel(snapshot.totals.varianceQty, avgVariance);

  const chartData = snapshot.history.map((h: any) => ({
    date: h.date,
    varianceQty: h.varianceQty,
    boRatePct: Math.round(h.boRate * 1000) / 10,
  }));

  return {
    sp,
    filters,
    rangeDays,
    snapshot,
    actions,
    p0Count,
    avgRevenue,
    avgVariance,
    prevPeriodRevenue,
    revenueTrendPct,
    boRisk,
    varianceRisk,
    chartData,
  };
}

