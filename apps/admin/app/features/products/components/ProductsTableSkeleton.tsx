import type { ReactElement } from "react";

export function ProductsTableSkeleton(): ReactElement {
  return (
    <div className="space-y-3">
      <div className="h-9 w-48 animate-pulse rounded-2xl bg-muted" />
      <div className="overflow-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-3 text-left font-medium">Product Name</th>
              <th className="px-3 py-3 text-right font-medium">Price</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                </td>
                <td className="px-3 py-3 flex justify-end">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-1">
                    <div className="h-7 w-7 animate-pulse rounded-lg bg-muted" />
                    <div className="h-7 w-7 animate-pulse rounded-lg bg-muted" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
