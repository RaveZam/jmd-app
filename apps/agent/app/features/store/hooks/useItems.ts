import { useState } from "react";
import type { Product } from "@/lib/mock/products";
import { mockProducts } from "@/lib/mock/products";

export type LoggedItem = {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  boQty: number;
  unitPrice: number;
};

let nextId = 1;

export function useItems() {
  const [items, setItems] = useState<LoggedItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);

  function logItem(productId: string, qty: number, boQty: number) {
    const product = mockProducts.find((p) => p.id === productId) as Product;
    if (!product || qty < 1) return;
    setItems((prev) => [
      ...prev,
      {
        id: `log-${nextId++}`,
        productId: product.id,
        productName: product.name,
        qty,
        boQty,
        unitPrice: product.unitPrice,
      },
    ]);
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function startEdit(item: LoggedItem) {
    setEditingId(item.id);
    setEditQty(item.qty);
  }

  function commitEdit(id: string) {
    if (editQty < 1) {
      deleteItem(id);
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty: editQty } : item)),
      );
    }
    setEditingId(null);
  }

  const totalPrice = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  const totalBoQty = items.reduce((sum, i) => sum + i.boQty, 0);

  return {
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
  };
}

