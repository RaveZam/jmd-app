import type { LedgerRecord } from "@/lib/mock/records";
import { deriveRecord } from "@/lib/selectors/metrics";
import type { DashboardSnapshot } from "./types";

function getDatesInRange(records: LedgerRecord[], endDate: string, rangeDays: number): string[] {
  const dates = Array.from(new Set(records.map((r) => r.date))).filter((d) => d <= endDate);
  dates.sort((a, b) => b.localeCompare(a));
  return dates.slice(0, rangeDays).sort((a, b) => a.localeCompare(b));
}

export function getDashboardSnapshot(
  records: LedgerRecord[],
  options: { endDate: string; rangeDays: number }
): DashboardSnapshot {
  const { endDate, rangeDays } = options;
  const datesInRange = getDatesInRange(records, endDate, rangeDays);
  const latestDate = datesInRange[datesInRange.length - 1] ?? endDate;

  const history = datesInRange.map((date) => {
    const dayRecords = records.filter((r) => r.date === date);
    let revenue = 0;
    let boQty = 0;
    let soldQty = 0;
    let varianceQty = 0;
    for (const r of dayRecords) {
      const d = deriveRecord(r);
      revenue += d.lineTotal;
      boQty += r.boQty;
      soldQty += r.soldQty;
      varianceQty += d.varianceQty;
    }
    const denom = soldQty + boQty;
    const boRate = denom <= 0 ? 0 : boQty / denom;
    return { date, revenue, boRate, varianceQty };
  });

  const todayRecords = records.filter((r) => r.date === latestDate);
  let deliveredQty = 0;
  let soldQty = 0;
  let revenue = 0;
  let boQty = 0;
  let varianceQty = 0;
  for (const r of todayRecords) {
    const d = deriveRecord(r);
    deliveredQty += r.deliveredQty;
    soldQty += r.soldQty;
    revenue += d.lineTotal;
    boQty += r.boQty;
    varianceQty += d.varianceQty;
  }
  const denom = soldQty + boQty;
  const boRate = denom <= 0 ? 0 : boQty / denom;

  const byAgent = new Map<string, { revenue: number; boQty: number; soldQty: number; varianceQty: number }>();
  for (const r of todayRecords) {
    const d = deriveRecord(r);
    const existing = byAgent.get(r.agent);
    if (existing) {
      existing.revenue += d.lineTotal;
      existing.boQty += r.boQty;
      existing.soldQty += r.soldQty;
      existing.varianceQty += d.varianceQty;
    } else {
      byAgent.set(r.agent, {
        revenue: d.lineTotal,
        boQty: r.boQty,
        soldQty: r.soldQty,
        varianceQty: d.varianceQty,
      });
    }
  }
  const agents = Array.from(byAgent.entries()).map(([name, a]) => {
    const denomA = a.soldQty + a.boQty;
    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      revenue: a.revenue,
      boRate: denomA <= 0 ? 0 : a.boQty / denomA,
      varianceQty: a.varianceQty,
    };
  });

  const byStore = new Map<string, { revenue: number; boQty: number; soldQty: number }>();
  for (const r of todayRecords) {
    const d = deriveRecord(r);
    const existing = byStore.get(r.store);
    if (existing) {
      existing.revenue += d.lineTotal;
      existing.boQty += r.boQty;
      existing.soldQty += r.soldQty;
    } else {
      byStore.set(r.store, {
        revenue: d.lineTotal,
        boQty: r.boQty,
        soldQty: r.soldQty,
      });
    }
  }
  const stores = Array.from(byStore.entries()).map(([name, s]) => {
    const denomS = s.soldQty + s.boQty;
    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      revenue: s.revenue,
      boRate: denomS <= 0 ? 0 : s.boQty / denomS,
    };
  });

  return {
    date: latestDate,
    totals: {
      deliveredQty,
      soldQty,
      revenue,
      boQty,
      varianceQty,
      boRate,
    },
    agents,
    stores,
    history,
  };
}
