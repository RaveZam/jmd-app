import { useRef, useState } from "react";
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

const makeLogItem =
  (setItems: React.Dispatch<React.SetStateAction<LoggedItem[]>>, mockProductsLocal: Product[], nextIdRef: React.MutableRefObject<number>) =>
  (productId: string, qty: number, boQty: number): void => {
    const product = mockProductsLocal.find((p) => p.id === productId) as Product;
    if (!product || (qty < 1 && boQty < 1)) return;
    setItems((prev) => [
      ...prev,
      {
        id: `log-${nextIdRef.current++}`,
        productId: product.id,
        productName: product.name,
        qty,
        boQty,
        unitPrice: product.unitPrice,
      },
    ]);
  };

const makeDeleteItem = (setItems: React.Dispatch<React.SetStateAction<LoggedItem[]>>) => (id: string): void => {
  setItems((prev) => prev.filter((item) => item.id !== id));
};

const makeStartEdit =
  (setEditingId: React.Dispatch<React.SetStateAction<string | null>>, setEditQty: (v: number) => void) =>
  (item: LoggedItem): void => {
    setEditingId(item.id);
    setEditQty(item.qty);
  };

const makeCommitEdit =
  (editQtyRef: React.MutableRefObject<number>, setItems: React.Dispatch<React.SetStateAction<LoggedItem[]>>, setEditingId: React.Dispatch<React.SetStateAction<string | null>>) =>
  (id: string): void => {
    const editQty = editQtyRef.current;
    if (editQty < 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: editQty } : item)));
    }
    setEditingId(null);
  };

export function useItems() {
  const [items, setItems] = useState<LoggedItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);
  const editQtyRef = useRef(editQty);
  const nextIdRef = useRef(1);

  // keep ref in sync
  editQtyRef.current = editQty;

  const logItem = makeLogItem(setItems, mockProducts, nextIdRef);
  const deleteItem = makeDeleteItem(setItems);
  const startEdit = makeStartEdit(setEditingId, setEditQty);
  const commitEdit = makeCommitEdit(editQtyRef, setItems, setEditingId);

  const updateQty = (id: string, delta: number): void => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          return { ...item, qty: Math.max(0, item.qty + delta) };
        })
        .filter((item) => item.qty > 0 || item.boQty > 0),
    );
  };

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
    updateQty,
    totalPrice,
    totalBoQty,
  };
}

