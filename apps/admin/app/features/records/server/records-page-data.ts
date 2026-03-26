import type { LedgerRecord } from "@/lib/mock/records";
import {
  ALL_AGENTS,
  ALL_SESSIONS,
  type RecordsFilters,
} from "@/lib/selectors/filters";
import {
  deriveRecord,
  selectAgents,
  type RecordDerived,
} from "@/lib/selectors/metrics";

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function filterRecordsForPage(
  records: LedgerRecord[],
  filters: RecordsFilters,
  sessionSaleIds: Set<string> | null,
): LedgerRecord[] {
  return records.filter((r) => {
    if (r.date < filters.dateFrom || r.date > filters.dateTo) return false;
    if (filters.agent !== ALL_AGENTS && r.agent !== filters.agent) return false;
    if (sessionSaleIds !== null && !sessionSaleIds.has(r.id)) return false;
    return true;
  });
}

export type RecordsPageRow = { record: LedgerRecord; derived: RecordDerived };

export type RecordsPageTotals = {
  soldQty: number;
  boQty: number;
  lineTotal: number;
};

export type RecordsPageData = {
  agents: string[];
  filters: RecordsFilters;
  pageRows: RecordsPageRow[];
  totals: RecordsPageTotals;
  page: number;
  totalPages: number;
  rowCount: number;
  rawQuery: string;
};

export function getRecordsPageData(
  records: LedgerRecord[],
  filters: RecordsFilters,
  sessionSaleIds: Set<string> | null,
  sp: SearchParams,
  pageSize = 25,
): RecordsPageData {
  const agents = selectAgents(records);
  const rawQuery = (firstParam(sp, "q") ?? "").trim();
  const q = rawQuery.toLowerCase();
  const rawPage = Number(firstParam(sp, "page") ?? "1");
  const requestedPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const base = filterRecordsForPage(records, filters, sessionSaleIds);
  const searched = q
    ? base.filter(
        (r) =>
          r.store.toLowerCase().includes(q) ||
          r.product.toLowerCase().includes(q),
      )
    : base;

  const rows = searched.map((r) => ({ record: r, derived: deriveRecord(r) }));

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const pageStart = (page - 1) * pageSize;
  const pageRows = rows.slice(pageStart, pageStart + pageSize);

  const totals = rows.reduce<RecordsPageTotals>(
    (acc, row) => {
      acc.soldQty += row.record.soldQty;
      acc.boQty += row.record.boQty;
      acc.lineTotal += row.derived.lineTotal;
      return acc;
    },
    { soldQty: 0, boQty: 0, lineTotal: 0 },
  );

  return {
    agents,
    filters,
    pageRows,
    totals,
    page,
    totalPages,
    rowCount: rows.length,
    rawQuery,
  };
}

export function buildRecordsPageUrl(
  sp: SearchParams,
  next: Record<string, string | null>,
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k === "date") continue;
    const value = Array.isArray(v) ? v[0] : v;
    if (typeof value === "string" && value.length) params.set(k, value);
  }
  for (const [k, v] of Object.entries(next)) {
    if (!v) params.delete(k);
    else params.set(k, v);
  }
  return `/records?${params.toString()}`;
}

// Re-export for convenience
export { ALL_SESSIONS };
