import { useState, useCallback } from "react";
import type { Product } from "../types/store-types";

export type LoggedItem = {
  productId: string;
  productName: string;
  price: number;
  qty: number;
  boQty: number;
  boReason?: string;
};

export function useDistributionLog(products: Product[]) {
  const [loggedItems, setLoggedItems] = useState<LoggedItem[]>([]);

  const logItem = useCallback(
    (productId: string, qty: number, boQty: number, boReason?: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product || (qty === 0 && boQty === 0)) return;
      setLoggedItems((prev) => {
        const next = [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            qty,
            boQty,
            boReason,
          },
        ];
        console.log("[useDistributionLog] loggedItems:", next);
        return next;
      });
    },
    [products],
  );

  const updateItemQty = useCallback((index: number, delta: number) => {
    setLoggedItems((prev) =>
      prev
        .map((item, i) => {
          if (i !== index) return item;
          return { ...item, qty: Math.max(0, item.qty + delta) };
        })
        .filter((item) => item.qty > 0 || item.boQty > 0),
    );
  }, []);

  const removeItem = useCallback((index: number) => {
    setLoggedItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return { loggedItems, logItem, updateItemQty, removeItem };
}
