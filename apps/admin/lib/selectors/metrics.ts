import type { LedgerRecord } from "@/lib/mock/records";
import { ALL_AGENTS, type AdminFilters } from "@/lib/selectors/filters";

export type RecordDerived = {
  lineTotal: number;
  boValue: number;
  varianceQty: number;
  varianceValue: number;
  status: "OK" | "Issue";
};

export type DashboardKpis = {
  totalSales: number;
  totalBOQty: number;
  totalBOValue: number;
  totalDeliveredQty: number;
  totalSoldQty: number;
  varianceQty: number;
  varianceValue: number;
  boRate: number; // 0..1
};

export type VarianceAlert = {
  date: string;
  agent: string;
  varianceQty: number;
  varianceValue: number;
  boQty: number;
  boValue: number;
  rows: number;
};

export type HighBOAgent = {
  agent: string;
  boQty: number;
  boValue: number;
  soldQty: number;
  boRate: number;
};

export type TopProduct = {
  product: string;
  qty: number;
  value: number;
};

export function deriveRecord(r: LedgerRecord): RecordDerived {
  const returned = r.returnedQty ?? 0;
  const lineTotal = r.soldQty * r.unitPrice;
  const boValue = r.boQty * r.unitPrice;
  const varianceQty = r.deliveredQty - r.soldQty - r.boQty - returned;
  const varianceValue = varianceQty * r.unitPrice;
  const status: RecordDerived["status"] = varianceQty === 0 && r.boQty === 0 ? "OK" : "Issue";
  return { lineTotal, boValue, varianceQty, varianceValue, status };
}

export function selectAgents(records: LedgerRecord[]): string[] {
  return Array.from(new Set(records.map((r) => r.agent))).sort((a, b) => a.localeCompare(b));
}

export function filterRecords(records: LedgerRecord[], filters: AdminFilters): LedgerRecord[] {
  return records.filter((r) => {
    if (r.date !== filters.date) return false;
    if (filters.agent !== ALL_AGENTS && r.agent !== filters.agent) return false;
    return true;
  });
}

export function selectDashboardKpis(records: LedgerRecord[], filters: AdminFilters): DashboardKpis {
  const filtered = filterRecords(records, filters);
  let totalSales = 0;
  let totalBOQty = 0;
  let totalBOValue = 0;
  let totalDeliveredQty = 0;
  let totalSoldQty = 0;
  let varianceQty = 0;
  let varianceValue = 0;

  for (const r of filtered) {
    const d = deriveRecord(r);
    totalSales += d.lineTotal;
    totalBOQty += r.boQty;
    totalBOValue += d.boValue;
    totalDeliveredQty += r.deliveredQty;
    totalSoldQty += r.soldQty;
    varianceQty += d.varianceQty;
    varianceValue += d.varianceValue;
  }

  const denom = totalSoldQty + totalBOQty;
  const boRate = denom <= 0 ? 0 : totalBOQty / denom;

  return {
    totalSales,
    totalBOQty,
    totalBOValue,
    totalDeliveredQty,
    totalSoldQty,
    varianceQty,
    varianceValue,
    boRate,
  };
}

export function selectVarianceAlerts(records: LedgerRecord[], filters: AdminFilters): VarianceAlert[] {
  const filtered = filterRecords(records, filters);
  const byAgentDay = new Map<string, VarianceAlert>();

  for (const r of filtered) {
    const key = `${r.agent}__${r.date}`;
    const d = deriveRecord(r);
    const existing = byAgentDay.get(key);
    if (existing) {
      existing.varianceQty += d.varianceQty;
      existing.varianceValue += d.varianceValue;
      existing.boQty += r.boQty;
      existing.boValue += d.boValue;
      existing.rows += 1;
    } else {
      byAgentDay.set(key, {
        date: r.date,
        agent: r.agent,
        varianceQty: d.varianceQty,
        varianceValue: d.varianceValue,
        boQty: r.boQty,
        boValue: d.boValue,
        rows: 1,
      });
    }
  }

  return Array.from(byAgentDay.values())
    .filter((a) => a.varianceQty !== 0 || a.boQty !== 0)
    .sort((a, b) => Math.abs(b.varianceQty) - Math.abs(a.varianceQty));
}

export function selectHighBOAgents(records: LedgerRecord[], filters: AdminFilters): HighBOAgent[] {
  const filtered = filterRecords(records, filters);
  const byAgent = new Map<string, Omit<HighBOAgent, "boRate">>();

  for (const r of filtered) {
    const d = deriveRecord(r);
    const existing = byAgent.get(r.agent);
    if (existing) {
      existing.boQty += r.boQty;
      existing.boValue += d.boValue;
      existing.soldQty += r.soldQty;
    } else {
      byAgent.set(r.agent, {
        agent: r.agent,
        boQty: r.boQty,
        boValue: d.boValue,
        soldQty: r.soldQty,
      });
    }
  }

  return Array.from(byAgent.values())
    .map((a) => {
      const denom = a.soldQty + a.boQty;
      return { ...a, boRate: denom <= 0 ? 0 : a.boQty / denom };
    })
    .filter((a) => a.boQty > 0)
    .sort((a, b) => b.boQty - a.boQty);
}

export function selectTopProductsSold(records: LedgerRecord[], filters: AdminFilters, limit = 5): TopProduct[] {
  const filtered = filterRecords(records, filters);
  const byProduct = new Map<string, TopProduct>();

  for (const r of filtered) {
    const d = deriveRecord(r);
    const existing = byProduct.get(r.product);
    if (existing) {
      existing.qty += r.soldQty;
      existing.value += d.lineTotal;
    } else {
      byProduct.set(r.product, { product: r.product, qty: r.soldQty, value: d.lineTotal });
    }
  }

  return Array.from(byProduct.values())
    .filter((p) => p.qty > 0)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
}

export function selectTopProductsBO(records: LedgerRecord[], filters: AdminFilters, limit = 5): TopProduct[] {
  const filtered = filterRecords(records, filters);
  const byProduct = new Map<string, TopProduct>();

  for (const r of filtered) {
    const d = deriveRecord(r);
    const existing = byProduct.get(r.product);
    if (existing) {
      existing.qty += r.boQty;
      existing.value += d.boValue;
    } else {
      byProduct.set(r.product, { product: r.product, qty: r.boQty, value: d.boValue });
    }
  }

  return Array.from(byProduct.values())
    .filter((p) => p.qty > 0)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
}

