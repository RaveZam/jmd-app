"use client";

import { useState, type ReactElement } from "react";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrencyPHP } from "@/lib/utils";
import type { StoreRow } from "../types/store-types";
import { formatAddress } from "../helpers/storeHelpers";
import { StoreDetailModal } from "./StoreDetailModal";

type SortKey = "totalRevenue" | "visitCount" | "totalSales" | "totalBO";
type SortDir = "asc" | "desc" | null;

function SortIcon({
  column,
  sortKey,
  sortDir,
}: {
  column: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
}): ReactElement {
  if (sortKey !== column)
    return <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 opacity-40" />;
  if (sortDir === "asc")
    return <ChevronUp className="ml-1 inline h-3.5 w-3.5" />;
  return <ChevronDown className="ml-1 inline h-3.5 w-3.5" />;
}

function StoreTableRow({
  store,
  onClick,
}: {
  store: StoreRow;
  onClick: (store: StoreRow) => void;
}): ReactElement {
  return (
    <tr
      className="border-t cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onClick(store)}
    >
      <td className="px-3 py-2.5">
        <p className="text-sm font-medium">{store.storeName}</p>
        <p className="text-xs text-muted-foreground">
          {formatAddress(store.barangay, store.city, store.province)}
        </p>
      </td>
      <td className="px-3 py-2.5 text-sm">{store.contactName ?? "—"}</td>
      <td className="px-3 py-2.5 text-sm tabular-nums">
        {store.contactNumber ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-right text-sm tabular-nums">
        {store.totalSales}
      </td>
      <td className="px-3 py-2.5 text-right text-sm tabular-nums">
        {store.totalBO}
      </td>
      <td className="px-3 py-2.5 text-right text-sm tabular-nums">
        {formatCurrencyPHP(store.totalRevenue)}
      </td>
      <td className="px-3 py-2.5 text-center">
        <Badge variant={store.visitCount > 0 ? "success" : "pending"}>
          {store.visitCount}
        </Badge>
      </td>
    </tr>
  );
}

function StoreTotalsRow({ stores }: { stores: StoreRow[] }): ReactElement {
  const totalSales = stores.reduce((sum, s) => sum + s.totalSales, 0);
  const totalBO = stores.reduce((sum, s) => sum + s.totalBO, 0);
  const totalRevenue = stores.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalVisits = stores.reduce((sum, s) => sum + s.visitCount, 0);

  return (
    <tr className="border-t bg-muted/30">
      <td
        className="px-3 py-3 text-xs font-medium text-muted-foreground"
        colSpan={3}
      >
        Totals ({stores.length} stores)
      </td>
      <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
        {totalSales}
      </td>
      <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
        {totalBO}
      </td>
      <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
        {formatCurrencyPHP(totalRevenue)}
      </td>
      <td className="px-3 py-3 text-center text-sm font-semibold tabular-nums">
        {totalVisits}
      </td>
    </tr>
  );
}

export function StoresTable({ stores }: { stores: StoreRow[] }): ReactElement {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [selectedStore, setSelectedStore] = useState<StoreRow | null>(null);

  function handleSort(key: SortKey): void {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortDir("asc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const sorted = [...stores].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const mult = sortDir === "asc" ? 1 : -1;
    return mult * (a[sortKey] - b[sortKey]);
  });

  return (
    <>
      <div className="overflow-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 text-xs text-muted-foreground backdrop-blur">
            <tr>
              <th className="px-3 py-3 text-left font-medium">Store</th>
              <th className="px-3 py-3 text-left font-medium">Contact</th>
              <th className="px-3 py-3 text-left font-medium">Phone</th>
              <th className="px-3 py-3 text-right font-medium">
                <button
                  type="button"
                  className="ml-auto flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("totalSales")}
                >
                  Sold
                  <SortIcon
                    column="totalSales"
                    sortKey={sortKey}
                    sortDir={sortDir}
                  />
                </button>
              </th>
              <th className="px-3 py-3 text-right font-medium">
                <button
                  type="button"
                  className="ml-auto flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("totalBO")}
                >
                  BO
                  <SortIcon
                    column="totalBO"
                    sortKey={sortKey}
                    sortDir={sortDir}
                  />
                </button>
              </th>
              <th className="px-3 py-3 text-right font-medium">
                <button
                  type="button"
                  className="ml-auto flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("totalRevenue")}
                >
                  Revenue
                  <SortIcon
                    column="totalRevenue"
                    sortKey={sortKey}
                    sortDir={sortDir}
                  />
                </button>
              </th>
              <th className="px-3 py-3 text-center font-medium">
                <button
                  type="button"
                  className="mx-auto flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("visitCount")}
                >
                  Visits
                  <SortIcon
                    column="visitCount"
                    sortKey={sortKey}
                    sortDir={sortDir}
                  />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-10 text-center text-muted-foreground"
                >
                  No stores found.
                </td>
              </tr>
            ) : (
              sorted.map((store) => (
                <StoreTableRow
                  key={store.id}
                  store={store}
                  onClick={setSelectedStore}
                />
              ))
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot>
              <StoreTotalsRow stores={stores} />
            </tfoot>
          )}
        </table>
      </div>

      <StoreDetailModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
      />
    </>
  );
}
