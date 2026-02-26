 "use client";

import { useState } from "react";
import type { ReactElement } from "react";
import type { Product } from "@/lib/mock/products";

type Props = {
  products: Product[];
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  logItem: (productId: string, qty: number, boQty: number) => void;
};

export default function StoreItemAdder({ products, selectedProductId, setSelectedProductId, logItem }: Props): ReactElement {
  const [qty, setQty] = useState(1);
  const [boQty, setBoQty] = useState(0);

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-emerald-900/70 dark:text-zinc-400">Product</span>
        <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="mt-1 w-full rounded-full border-b border-black/20 bg-white px-4 py-3 text-sm">
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ₱{p.unitPrice}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-2">
        <label className="w-1/2">
          <span className="text-xs font-medium text-emerald-900/70 dark:text-zinc-400">Qty</span>
          <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="mt-1 w-full rounded-full border-b border-black/40 bg-white px-4 py-3 text-center text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" />
        </label>
        <label className="w-1/2">
          <span className="text-xs font-medium text-emerald-900/70 dark:text-zinc-400">BO Qty</span>
          <input type="number" min={0} value={boQty} onChange={(e) => setBoQty(Math.max(0, Number(e.target.value)))} className="mt-1 w-full rounded-full border-b border-black/40 bg-white px-4 py-3 text-center text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" />
        </label>
      </div>

      <button
        type="button"
        onClick={() => {
          logItem(selectedProductId, qty, boQty);
        }}
        className="w-full rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg"
      >
        Log product
      </button>
    </div>
  );
}

