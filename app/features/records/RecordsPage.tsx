import type { ReactElement } from "react";
import Link from "next/link";

import { FiltersBar } from "@/components/admin/FiltersBar";
import { RecordsToolbar } from "@/app/features/records/components/RecordsToolbar";
import { Badge } from "@/components/ui/badge";
import { mockRecords } from "@/lib/mock/records";
import { ALL_AGENTS, parseAdminFilters } from "@/lib/selectors/filters";
import { deriveRecord, filterRecords, selectAgents } from "@/lib/selectors/metrics";

function firstParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const v = searchParams[key];
  return Array.isArray(v) ? v[0] : v;
}

function formatCurrencyPHP(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  return `${sign}₱${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function RecordsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): ReactElement {
  const filters = parseAdminFilters(searchParams);
  const agents = selectAgents(mockRecords);

  const rawQuery = (firstParam(searchParams, "q") ?? "").trim();
  const q = rawQuery.toLowerCase();
  const sort = firstParam(searchParams, "sort") ?? "varianceDesc";

  const pageSize = 25;
  const rawPage = Number(firstParam(searchParams, "page") ?? "1");
  const requestedPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const base = filterRecords(mockRecords, filters);
  const searched = q
    ? base.filter((r) => {
        return (
          r.store.toLowerCase().includes(q) || r.product.toLowerCase().includes(q)
        );
      })
    : base;

  const rows = searched
    .map((r) => ({ record: r, derived: deriveRecord(r) }))
    .sort((a, b) => {
      const diff = a.derived.varianceQty - b.derived.varianceQty;
      if (sort === "varianceAsc") return diff;
      return -diff;
    });

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const pageStart = (page - 1) * pageSize;
  const pageRows = rows.slice(pageStart, pageStart + pageSize);

  const totals = rows.reduce(
    (acc, row) => {
      acc.deliveredQty += row.record.deliveredQty;
      acc.soldQty += row.record.soldQty;
      acc.boQty += row.record.boQty;
      acc.lineTotal += row.derived.lineTotal;
      acc.varianceQty += row.derived.varianceQty;
      return acc;
    },
    { deliveredQty: 0, soldQty: 0, boQty: 0, lineTotal: 0, varianceQty: 0 }
  );

  function hrefWith(next: Record<string, string | null>): string {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      const value = Array.isArray(v) ? v[0] : v;
      if (typeof value === "string" && value.length) params.set(k, value);
    }
    for (const [k, v] of Object.entries(next)) {
      if (!v) params.delete(k);
      else params.set(k, v);
    }
    return `/records?${params.toString()}`;
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Records</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Master Ledger (Phase 1). Read-only.
            </p>
          </div>
          <div className="space-y-4">
            <FiltersBar
              agents={agents}
              dateDefault={filters.date}
              agentDefault={ALL_AGENTS}
            />
            <RecordsToolbar defaultQuery={rawQuery} defaultSort={sort} />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{rows.length}</span>{" "}
              records
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={hrefWith({ page: String(Math.max(1, page - 1)) })}
                className={`rounded-xl border px-3 py-2 ${
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-muted"
                }`}
              >
                Prev
              </Link>
              <span className="text-muted-foreground">
                Page <span className="font-medium text-foreground">{page}</span>{" "}
                / {totalPages}
              </span>
              <Link
                href={hrefWith({ page: String(Math.min(totalPages, page + 1)) })}
                className={`rounded-xl border px-3 py-2 ${
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-muted"
                }`}
              >
                Next
              </Link>
            </div>
          </div>

          <div className="overflow-auto rounded-2xl border bg-card shadow-soft">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="sticky top-0 z-10 bg-muted/60 text-xs text-muted-foreground backdrop-blur">
                <tr>
                  <th className="px-3 py-3 text-left font-medium">Date</th>
                  <th className="px-3 py-3 text-left font-medium">Agent</th>
                  <th className="px-3 py-3 text-left font-medium">Store</th>
                  <th className="px-3 py-3 text-left font-medium">Product</th>
                  <th className="px-3 py-3 text-right font-medium">Delivered</th>
                  <th className="px-3 py-3 text-right font-medium">Sold</th>
                  <th className="px-3 py-3 text-right font-medium">BO</th>
                  <th className="px-3 py-3 text-right font-medium">Unit ₱</th>
                  <th className="px-3 py-3 text-right font-medium">Line Total</th>
                  <th className="px-3 py-3 text-right font-medium">Variance</th>
                  <th className="px-3 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length ? (
                  pageRows.map(({ record, derived }) => (
                    <tr key={record.id} className="border-t">
                      <td className="px-3 py-2 tabular-nums">{record.date}</td>
                      <td className="px-3 py-2">{record.agent}</td>
                      <td className="px-3 py-2">{record.store}</td>
                      <td className="px-3 py-2">{record.product}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {record.deliveredQty}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {record.soldQty}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {record.boQty}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatCurrencyPHP(record.unitPrice)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatCurrencyPHP(derived.lineTotal)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {derived.varianceQty}
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          variant={
                            derived.status === "OK" ? "success" : "warning"
                          }
                        >
                          {derived.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-3 py-10 text-center text-muted-foreground"
                    >
                      No records for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t bg-muted/30">
                  <td
                    className="px-3 py-3 text-xs font-medium text-muted-foreground"
                    colSpan={4}
                  >
                    Totals
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
                    {totals.deliveredQty}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
                    {totals.soldQty}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
                    {totals.boQty}
                  </td>
                  <td className="px-3 py-3" />
                  <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
                    {formatCurrencyPHP(totals.lineTotal)}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
                    {totals.varianceQty}
                  </td>
                  <td className="px-3 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecordsPage;

