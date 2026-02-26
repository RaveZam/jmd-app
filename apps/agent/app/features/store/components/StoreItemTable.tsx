"use client";

import type { ReactElement } from "react";
import type { LoggedItem } from "../hooks/useItems";

type Props = {
  items: LoggedItem[];
  editingId: string | null;
  editQty: number;
  setEditQty: (v: number) => void;
  startEdit: (item: LoggedItem) => void;
  commitEdit: (id: string) => void;
  deleteItem: (id: string) => void;
  totalPrice: number;
  totalBoQty: number;
};

export default function StoreItemTable({ items, editingId, editQty, setEditQty, startEdit, commitEdit, deleteItem, totalPrice, totalBoQty }: Props): ReactElement {
  if (items.length === 0) {
    return <div className="rounded-xl border border-dashed border-emerald-200/60 p-8 text-center text-sm text-emerald-900/40 dark:border-zinc-800 dark:text-zinc-600">No items logged yet. Select a product and tap Log.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-100/60 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-emerald-100/60 bg-emerald-50/50 text-xs text-emerald-900/60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
            <th className="px-4 py-2.5 text-left font-medium">Product</th>
            <th className="px-4 py-2.5 text-right font-medium">Qty</th>
            <th className="px-4 py-2.5 text-right font-medium">BO Qty</th>
            <th className="px-4 py-2.5 text-right font-medium">Price</th>
            <th className="w-10 px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-emerald-100/40 last:border-b-0 dark:border-zinc-800/60">
              <td className="px-4 py-3 font-medium text-emerald-950 dark:text-zinc-100">{item.productName}</td>
              <td className="px-4 py-3 text-right text-emerald-900/80 dark:text-zinc-300">
                {editingId === item.id ? (
                  <input type="number" min={0} value={editQty} onChange={(e) => setEditQty(Number(e.target.value))} onBlur={() => commitEdit(item.id)} onKeyDown={(e) => { if (e.key === "Enter") commitEdit(item.id); }} autoFocus className="w-16 rounded-lg border border-emerald-200 bg-white px-2 py-1 text-right text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" />
                ) : (
                  <button type="button" onClick={() => startEdit(item)} className="cursor-pointer rounded-lg px-2 py-1 hover:bg-emerald-50 dark:hover:bg-zinc-800">{item.qty}</button>
                )}
              </td>
              <td className="px-4 py-3 text-right text-emerald-900/80 dark:text-zinc-300">{item.boQty}</td>
              <td className="px-4 py-3 text-right font-medium text-emerald-950 dark:text-zinc-100">₱{(item.qty * item.unitPrice).toLocaleString()}</td>
              <td className="px-2 py-3 text-center">
                <button type="button" onClick={() => deleteItem(item.id)} aria-label={`Delete ${item.productName}`} className="inline-flex h-7 w-7 items-center justify-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-emerald-200/60 bg-emerald-50/30 dark:border-zinc-700 dark:bg-zinc-900/50">
            <td className="px-4 py-3 text-xs font-medium text-emerald-900/60 dark:text-zinc-500">Total</td>
            <td className="px-4 py-3 text-right text-xs text-emerald-900/60 dark:text-zinc-500">{items.reduce((sum, i) => sum + i.qty, 0)}</td>
            <td className="px-4 py-3 text-right text-xs text-emerald-900/60 dark:text-zinc-500">{totalBoQty}</td>
            <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-950 dark:text-zinc-100">₱{totalPrice.toLocaleString()}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

