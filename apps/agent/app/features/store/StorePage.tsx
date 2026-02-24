"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import Link from "next/link";

import { useStore } from "./hooks/useStore";
import { useProducts } from "./hooks/useProducts";
import { useItems } from "./hooks/useItems";

export function StorePage(): ReactElement {
  const { store } = useStore();
  const {
    mockProducts: products,
    selectedProductId,
    setSelectedProductId,
  } = useProducts();
  const {
    items,
    logItem,
    deleteItem,
    editingId,
    startEdit,
    commitEdit,
    editQty,
    setEditQty,
    totalPrice,
    totalBoQty,
  } = useItems();

  const [qty, setQty] = useState(1);
  const [boQty, setBoQty] = useState(0);

  if (!store) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white dark:bg-black">
        <p className="text-sm text-zinc-500">Store not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-20">
        <div className="mx-auto w-full max-w-[720px]">
          <div className="bg-[linear-gradient(to_bottom_right,#064e3b_0%,#065f46_50%,#047857_100%)] p-4 text-white shadow-soft">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                aria-label="Back"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Distribution Log</h1>
                <p className="mt-1 text-sm text-emerald-50/90">
                  Log items distributed to this store.
                </p>
              </div>
            </div>
          </div>

          {/* Store details */}
          <div className="border-b border-emerald-100/60 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-base font-semibold tracking-tight text-emerald-950 dark:text-zinc-50">
              {store.name}
            </p>
            <p className="mt-0.5 text-sm text-emerald-900/70 dark:text-zinc-400">
              {store.area} &middot; {store.addressLine}
            </p>
            {(store.contactName || store.contactPhone) && (
              <p className="mt-0.5 text-xs text-emerald-900/50 dark:text-zinc-500">
                {[store.contactName, store.contactPhone]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="px-5 py-5">
        <div className="mx-auto w-full max-w-[720px] space-y-5">
          {/* Item Add Bar */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-emerald-900/70 dark:text-zinc-400">
                Product
              </span>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="mt-1 w-full rounded-full border-b border-black/20 bg-white px-4 py-3 text-sm"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₱{p.unitPrice}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-2">
              <label className="w-1/2">
                <span className="text-xs font-medium text-emerald-900/70 dark:text-zinc-400">
                  Qty
                </span>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-full rounded-full border-b border-black/40 bg-white px-4 py-3 text-center text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </label>
              <label className="w-1/2">
                <span className="text-xs font-medium text-emerald-900/70 dark:text-zinc-400">
                  BO Qty
                </span>
                <input
                  type="number"
                  min={0}
                  value={boQty}
                  onChange={(e) =>
                    setBoQty(Math.max(0, Number(e.target.value)))
                  }
                  className="mt-1 w-full rounded-full border-b border-black/40 bg-white px-4 py-3 text-center text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                logItem(selectedProductId, qty, boQty);
                setQty(1);
                setBoQty(0);
              }}
              className="w-full rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg"
            >
              Log product
            </button>
          </div>

          {/* Item List Table */}
          {items.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-emerald-100/60 dark:border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-100/60 bg-emerald-50/50 text-xs text-emerald-900/60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
                    <th className="px-4 py-2.5 text-left font-medium">
                      Product
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium">Qty</th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      BO Qty
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Price
                    </th>
                    <th className="w-10 px-2 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-emerald-100/40 last:border-b-0 dark:border-zinc-800/60"
                    >
                      <td className="px-4 py-3 font-medium text-emerald-950 dark:text-zinc-100">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-900/80 dark:text-zinc-300">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            min={0}
                            value={editQty}
                            onChange={(e) => setEditQty(Number(e.target.value))}
                            onBlur={() => commitEdit(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit(item.id);
                            }}
                            autoFocus
                            className="w-16 rounded-lg border border-emerald-200 bg-white px-2 py-1 text-right text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="cursor-pointer rounded-lg px-2 py-1 hover:bg-emerald-50 dark:hover:bg-zinc-800"
                          >
                            {item.qty}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-900/80 dark:text-zinc-300">
                        {item.boQty}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-950 dark:text-zinc-100">
                        ₱{(item.qty * item.unitPrice).toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          aria-label={`Delete ${item.productName}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-emerald-200/60 bg-emerald-50/30 dark:border-zinc-700 dark:bg-zinc-900/50">
                    <td className="px-4 py-3 text-xs font-medium text-emerald-900/60 dark:text-zinc-500">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-emerald-900/60 dark:text-zinc-500">
                      {items.reduce((sum, i) => sum + i.qty, 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-emerald-900/60 dark:text-zinc-500">
                      {totalBoQty}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-950 dark:text-zinc-100">
                      ₱{totalPrice.toLocaleString()}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-emerald-200/60 p-8 text-center text-sm text-emerald-900/40 dark:border-zinc-800 dark:text-zinc-600">
              No items logged yet. Select a product and tap Log.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StorePage;
