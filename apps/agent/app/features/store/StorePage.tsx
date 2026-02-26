"use client";

import type { ReactElement } from "react";
import { useStore } from "./hooks/useStore";
import { useProducts } from "./hooks/useProducts";
import { useItems } from "./hooks/useItems";
import StoreItemTable from "./components/StoreItemTable";
import StoreItemAdder from "./components/StoreItemAdder";
import StoreHeader from "./components/StoreHeader";

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

  if (!store) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white dark:bg-black">
        <p className="text-sm text-zinc-500">Store not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white dark:bg-black">
      <StoreHeader store={store} />

      <main className="px-5 py-5">
        <div className="mx-auto w-full max-w-[720px] space-y-5">
          <StoreItemAdder
            products={products}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            logItem={logItem}
          />

          <StoreItemTable
            items={items}
            editingId={editingId}
            editQty={editQty}
            setEditQty={setEditQty}
            startEdit={startEdit}
            commitEdit={commitEdit}
            deleteItem={deleteItem}
            totalPrice={totalPrice}
            totalBoQty={totalBoQty}
          />
        </div>
      </main>
    </div>
  );
}

export default StorePage;
