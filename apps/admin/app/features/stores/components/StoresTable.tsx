import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { formatCurrencyPHP } from "@/lib/utils";
import type { StoreRow } from "../types/store-types";
import { formatAddress } from "../helpers/storeHelpers";

function StoreTableRow({ store }: { store: StoreRow }): ReactElement {
  return (
    <tr className="border-t">
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

function StoreTotalsRow({
  stores,
}: {
  stores: StoreRow[];
}): ReactElement {
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

export function StoresTable({
  stores,
}: {
  stores: StoreRow[];
}): ReactElement {
  return (
    <div className="overflow-auto rounded-2xl border bg-card shadow-soft">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="sticky top-0 z-10 bg-muted/60 text-xs text-muted-foreground backdrop-blur">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Store</th>
            <th className="px-3 py-3 text-left font-medium">Contact</th>
            <th className="px-3 py-3 text-left font-medium">Phone</th>
            <th className="px-3 py-3 text-right font-medium">Sold</th>
            <th className="px-3 py-3 text-right font-medium">BO</th>
            <th className="px-3 py-3 text-right font-medium">Revenue</th>
            <th className="px-3 py-3 text-center font-medium">Visits</th>
          </tr>
        </thead>
        <tbody>
          {stores.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-3 py-10 text-center text-muted-foreground"
              >
                No stores found.
              </td>
            </tr>
          ) : (
            stores.map((store) => (
              <StoreTableRow key={store.id} store={store} />
            ))
          )}
        </tbody>
        {stores.length > 0 && (
          <tfoot>
            <StoreTotalsRow stores={stores} />
          </tfoot>
        )}
      </table>
    </div>
  );
}
