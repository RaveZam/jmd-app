import { useEffect, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { X, Trophy } from "lucide-react";
import { ModalOverlay } from "@/app/features/products/components/ModalOverlay";
import { formatCurrencyPHP } from "@/lib/utils";
import type { StoreRow } from "../types/store-types";

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}): ReactElement {
  return (
    <div className="rounded-xl border bg-muted/30 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function StoreDetailModal({
  store,
  onClose,
}: {
  store: StoreRow | null;
  onClose: () => void;
}): ReactElement | null {
  useEffect(() => {
    if (!store) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [store, onClose]);

  if (!store) return null;

  const joined = new Date(store.createdAt).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const maxSold = store.topItems[0]?.sold ?? 1;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ModalOverlay onClose={onClose} />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="pointer-events-auto w-full rounded-2xl border bg-background shadow-xl">
          <div className="flex items-start justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-base font-semibold">{store.storeName}</h2>
              <p className="text-xs text-muted-foreground">Joined {joined}</p>
            </div>
            <button
              type="button"
              className="ml-4 rounded-lg p-1 hover:bg-muted transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          c
          <div className="flex divide-x">
            <div className="flex-1 space-y-4 px-5 py-4">
              <section>
                <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Location
                </h3>
                <div className="space-y-1 text-sm">
                  {store.province && (
                    <div className="flex gap-2">
                      <span className="w-20 shrink-0 text-muted-foreground">
                        Province
                      </span>
                      <span>{store.province}</span>
                    </div>
                  )}
                  {store.city && (
                    <div className="flex gap-2">
                      <span className="w-20 shrink-0 text-muted-foreground">
                        City
                      </span>
                      <span>{store.city}</span>
                    </div>
                  )}
                  {store.barangay && (
                    <div className="flex gap-2">
                      <span className="w-20 shrink-0 text-muted-foreground">
                        Barangay
                      </span>
                      <span>{store.barangay}</span>
                    </div>
                  )}
                  {!store.province && !store.city && !store.barangay && (
                    <span className="text-muted-foreground">
                      No address on file
                    </span>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Contact
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span className="w-20 shrink-0 text-muted-foreground">
                      Owner
                    </span>
                    <span>{store.contactName ?? "—"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 shrink-0 text-muted-foreground">
                      Phone
                    </span>
                    <span>{store.contactNumber ?? "—"}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Performance
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    label="Revenue"
                    value={formatCurrencyPHP(store.totalRevenue)}
                  />
                  <StatCard label="Sold" value={store.totalSales} />
                  <StatCard label="Back Orders" value={store.totalBO} />
                  <StatCard label="Visits" value={store.visitCount} />
                </div>
              </section>
            </div>

            {/* Right: items leaderboard */}
            <div className="w-56 shrink-0 px-4 py-4">
              <div className="mb-3 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Top Items
                </h3>
              </div>

              {store.topItems.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No sales recorded.
                </p>
              ) : (
                <ol className="space-y-2.5">
                  {store.topItems.map((item, i) => (
                    <li key={item.productName}>
                      <div className="mb-1 flex items-baseline justify-between gap-2">
                        <span className="truncate text-xs font-medium">
                          <span className="mr-1 tabular-nums text-muted-foreground">
                            {i + 1}.
                          </span>
                          {item.productName}
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {item.sold}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-muted">
                        <div
                          className="h-1 rounded-full bg-primary"
                          style={{ width: `${(item.sold / maxSold) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
