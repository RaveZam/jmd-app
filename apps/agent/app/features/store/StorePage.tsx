"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import type { Product } from "@/lib/mock/products";
import type { LoggedItem } from "./hooks/useItems";
import { useStore } from "./hooks/useStore";
import { useProducts } from "./hooks/useProducts";
import { useItems } from "./hooks/useItems";
import StoreHeader from "./components/StoreHeader";

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

type AdderPanelProps = {
  products: Product[];
  productId: string;
  onProductChange: (id: string) => void;
  qty: number;
  onQtyChange: (v: number) => void;
  onAdd: () => void;
  showPrice?: boolean;
};
function AdderPanel({ products, productId, onProductChange, qty, onQtyChange, onAdd, showPrice }: AdderPanelProps): ReactElement {
  return (
    <div className="mb-3 space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
      <select value={productId} onChange={(e) => onProductChange(e.target.value)} className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#0F172A]">
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}{showPrice ? ` — ₱${p.unitPrice}` : ""}</option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
          <button type="button" onClick={() => onQtyChange(Math.max(1, qty - 1))} className="w-5 text-center text-sm font-bold text-slate-600">−</button>
          <span className="w-8 text-center text-sm font-semibold text-[#0F172A]">{qty}</span>
          <button type="button" onClick={() => onQtyChange(qty + 1)} className="w-5 text-center text-sm font-bold text-slate-600">+</button>
        </div>
        <button type="button" onClick={onAdd} className="flex-1 rounded-lg bg-[#0b4c29] px-4 py-2 text-sm font-semibold text-white hover:bg-[#065f46]">Add</button>
      </div>
    </div>
  );
}

type SoldRowProps = { item: LoggedItem; onUpdateQty: (id: string, d: number) => void; onDelete: (id: string) => void };
function SoldOrderRow({ item, onUpdateQty, onDelete }: SoldRowProps): ReactElement {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#0F172A]">{item.productName}</p>
        <p className="text-xs text-slate-400">₱{item.unitPrice} / pack</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onUpdateQty(item.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-bold text-slate-600 hover:bg-[#F1F5F9]">−</button>
          <span className="w-8 text-center text-sm font-semibold text-[#0F172A]">{item.qty}</span>
          <button type="button" onClick={() => onUpdateQty(item.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-bold text-slate-600 hover:bg-[#F1F5F9]">+</button>
        </div>
        <span className="w-16 text-right text-sm font-semibold text-[#0F172A]">₱{(item.qty * item.unitPrice).toLocaleString()}</span>
        <button type="button" onClick={() => onDelete(item.id)} aria-label={`Remove ${item.productName}`} className="ml-1 text-red-300 hover:text-red-500"><XIcon /></button>
      </div>
    </div>
  );
}

type BadRowProps = { item: LoggedItem; onDelete: (id: string) => void };
function BadOrderRow({ item, onDelete }: BadRowProps): ReactElement {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0F172A]">{item.productName}</p>
      <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-500">damaged</span>
      <span className="shrink-0 text-sm font-semibold text-red-500">−{item.boQty}</span>
      <button type="button" onClick={() => onDelete(item.id)} aria-label={`Remove bad order ${item.productName}`} className="ml-1 text-red-300 hover:text-red-500"><XIcon /></button>
    </div>
  );
}

type SectionHeaderProps = { label: string; buttonLabel: string; onToggle: () => void };
function SectionHeader({ label, buttonLabel, onToggle }: SectionHeaderProps): ReactElement {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <button type="button" onClick={onToggle} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0b4c29] hover:bg-[#F0FDF4]">{buttonLabel}</button>
    </div>
  );
}

const EmptyPlaceholder = ({ text }: { text: string }) => (
  <div className="rounded-xl border border-dashed border-[#CBD5E1] p-6 text-center text-sm text-slate-400">{text}</div>
);

type SummaryProps = { totalPrice: number; totalBoPrice: number; netTotal: number };
function SummaryPanel({ totalPrice, totalBoPrice, netTotal }: SummaryProps): ReactElement {
  return (
    <>
      <div className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Gross sales</span><span>₱{totalPrice.toLocaleString()}</span>
          </div>
          {totalBoPrice > 0 && (
            <div className="flex justify-between text-sm text-slate-500">
              <span>Bad orders deduction</span><span className="text-red-500">−₱{totalBoPrice.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[#E2E8F0] pt-2 text-sm font-bold text-[#0F172A]">
            <span>Net total</span><span>₱{netTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <button type="button" className="w-full rounded-xl bg-[#0b4c29] py-3.5 text-sm font-semibold text-white hover:bg-[#065f46]">
        Confirm visit
      </button>
    </>
  );
}

export function StorePage(): ReactElement {
  const { store } = useStore();
  const { mockProducts: products, selectedProductId, setSelectedProductId } = useProducts();
  const { items, logItem, deleteItem, updateQty, totalPrice } = useItems();

  const [showSoldAdder, setShowSoldAdder] = useState(false);
  const [showBoAdder, setShowBoAdder] = useState(false);
  const [soldQty, setSoldQty] = useState(1);
  const [boQty, setBoQty] = useState(1);
  const [boProductId, setBoProductId] = useState(products[0]?.id ?? "");

  if (!store) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F0F0EB]">
        <p className="text-sm text-zinc-500">Store not found.</p>
      </div>
    );
  }

  const soldItems = items.filter((i) => i.qty > 0);
  const boItems = items.filter((i) => i.boQty > 0);
  const totalBoPrice = items.reduce((sum, i) => sum + i.boQty * i.unitPrice, 0);

  return (
    <div className="min-h-dvh bg-[#F0F0EB]">
      <StoreHeader store={store} />
      <main className="mx-auto w-full max-w-[720px] space-y-4 px-5 py-5">

        <section>
          <SectionHeader label="Sold Orders" buttonLabel="+ Add product" onToggle={() => { setShowSoldAdder(!showSoldAdder); setShowBoAdder(false); }} />
          {showSoldAdder && <AdderPanel products={products} productId={selectedProductId} onProductChange={setSelectedProductId} qty={soldQty} onQtyChange={setSoldQty} onAdd={() => { logItem(selectedProductId, soldQty, 0); setSoldQty(1); setShowSoldAdder(false); }} showPrice />}
          {soldItems.length > 0
            ? <div className="space-y-2">{soldItems.map((i) => <SoldOrderRow key={i.id} item={i} onUpdateQty={updateQty} onDelete={deleteItem} />)}</div>
            : <EmptyPlaceholder text="No sold orders yet." />}
        </section>

        <section>
          <SectionHeader label="Bad Orders" buttonLabel="+ Add" onToggle={() => { setShowBoAdder(!showBoAdder); setShowSoldAdder(false); }} />
          {showBoAdder && <AdderPanel products={products} productId={boProductId} onProductChange={setBoProductId} qty={boQty} onQtyChange={setBoQty} onAdd={() => { logItem(boProductId, 0, boQty); setBoQty(1); setShowBoAdder(false); }} />}
          {boItems.length > 0
            ? <div className="space-y-2">{boItems.map((i) => <BadOrderRow key={`${i.id}-bo`} item={i} onDelete={deleteItem} />)}</div>
            : <EmptyPlaceholder text="No bad orders." />}
        </section>

        <SummaryPanel totalPrice={totalPrice} totalBoPrice={totalBoPrice} netTotal={totalPrice - totalBoPrice} />

      </main>
    </div>
  );
}

export default StorePage;
