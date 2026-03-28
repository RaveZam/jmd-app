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
import type { LedgerRecord } from "@/app/features/records/types";

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

function searchRows(rows: RecordsPageRow[], q: string): RecordsPageRow[] {
  if (!q) return rows;
  return rows.filter(
    ({ record: r }) =>
      r.store.toLowerCase().includes(q) || r.product.toLowerCase().includes(q),
  );
}

function sumTotals(rows: RecordsPageRow[]): RecordsPageTotals {
  return rows.reduce<RecordsPageTotals>(
    (acc, { record: r, derived }) => {
      acc.soldQty += r.soldQty;
      acc.boQty += r.boQty;
      acc.lineTotal += derived.lineTotal;
      return acc;
    },
    { soldQty: 0, boQty: 0, lineTotal: 0 },
  );
}

export function getRecordsPageData(
  records: LedgerRecord[],
  filters: RecordsFilters,
  sessionSaleIds: Set<string> | null,
  sp: SearchParams,
  pageSize = 25,
): RecordsPageData {
  const agents = selectAgents(records);
  const rawQuery = (firstParam(sp, "q") ?? "").trim();
  const rawPage = Number(firstParam(sp, "page") ?? "1");
  const requestedPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const base = filterRecordsForPage(records, filters, sessionSaleIds);
  const allRows = searchRows(
    base.map((r) => ({ record: r, derived: deriveRecord(r) })),
    rawQuery.toLowerCase(),
  );

  const totalPages = Math.max(1, Math.ceil(allRows.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const pageRows = allRows.slice((page - 1) * pageSize, page * pageSize);

  return {
    agents,
    filters,
    pageRows,
    totals: sumTotals(allRows),
    page,
    totalPages,
    rowCount: allRows.length,
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
