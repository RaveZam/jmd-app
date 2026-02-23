import type { LedgerRecord } from "@/lib/mock/records";
import { ALL_AGENTS, parseAdminFilters } from "@/lib/selectors/filters";
import {
  deriveRecord,
  filterRecords,
  selectAgents,
  type RecordDerived,
} from "@/lib/selectors/metrics";

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export type RecordsPageRow = { record: LedgerRecord; derived: RecordDerived };

export type RecordsPageTotals = {
  deliveredQty: number;
  soldQty: number;
  boQty: number;
  lineTotal: number;
  varianceQty: number;
};

export type RecordsPageData = {
  agents: string[];
  filters: { date: string; agent: string };
  pageRows: RecordsPageRow[];
  totals: RecordsPageTotals;
  page: number;
  totalPages: number;
  rowCount: number;
  rawQuery: string;
  sort: string;
};

export function getRecordsPageData(
  records: LedgerRecord[],
  sp: SearchParams,
  pageSize = 25,
): RecordsPageData {
  const filters = parseAdminFilters(sp);
  const agents = selectAgents(records);
  const rawQuery = (firstParam(sp, "q") ?? "").trim();
  const q = rawQuery.toLowerCase();
  const sort = firstParam(sp, "sort") ?? "varianceDesc";
  const rawPage = Number(firstParam(sp, "page") ?? "1");
  const requestedPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const base = filterRecords(records, filters);
  const searched = q
    ? base.filter(
        (r) =>
          r.store.toLowerCase().includes(q) ||
          r.product.toLowerCase().includes(q),
      )
    : base;

  const rows = searched
    .map((r) => ({ record: r, derived: deriveRecord(r) }))
    .sort((a, b) => {
      const diff = a.derived.varianceQty - b.derived.varianceQty;
      return sort === "varianceAsc" ? diff : -diff;
    });

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const pageStart = (page - 1) * pageSize;
  const pageRows = rows.slice(pageStart, pageStart + pageSize);

  const totals = rows.reduce<RecordsPageTotals>(
    (acc, row) => {
      acc.deliveredQty += row.record.deliveredQty;
      acc.soldQty += row.record.soldQty;
      acc.boQty += row.record.boQty;
      acc.lineTotal += row.derived.lineTotal;
      acc.varianceQty += row.derived.varianceQty;
      return acc;
    },
    { deliveredQty: 0, soldQty: 0, boQty: 0, lineTotal: 0, varianceQty: 0 },
  );

  return {
    agents,
    filters: { date: filters.date, agent: filters.agent },
    pageRows,
    totals,
    page,
    totalPages,
    rowCount: rows.length,
    rawQuery,
    sort,
  };
}

export function buildRecordsPageUrl(
  sp: SearchParams,
  next: Record<string, string | null>,
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const value = Array.isArray(v) ? v[0] : v;
    if (typeof value === "string" && value.length) params.set(k, value);
  }
  for (const [k, v] of Object.entries(next)) {
    if (!v) params.delete(k);
    else params.set(k, v);
  }
  return `/records?${params.toString()}`;
}
