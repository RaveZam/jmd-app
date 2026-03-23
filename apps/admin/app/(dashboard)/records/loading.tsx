import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Records</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Master Ledger (Phase 1). Read-only.
            </p>
          </div>
          <div className="h-12 animate-pulse rounded-2xl bg-muted" />
          <div className="h-9 animate-pulse rounded-2xl bg-muted" />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="overflow-auto rounded-2xl border bg-card">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  {["Date", "Agent", "Store", "Product", "Delivered", "Sold", "BO", "Unit ₱", "Line Total", "Variance", "Status"].map((h) => (
                    <th key={h} className="px-3 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    {Array.from({ length: 11 }).map((__, j) => (
                      <td key={j} className="px-3 py-2">
                        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
