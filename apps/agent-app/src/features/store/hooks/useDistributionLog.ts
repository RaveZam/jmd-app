import { useState, useCallback } from "react";
import type { Product } from "../types/store-types";
import SalesDao from "@/lib/sqlite/dao/sales-dao";

export type LoggedItem = {
  saleId: string;
  productId: string;
  productName: string;
  price: number;
  qty: number;
  boQty: number;
  boReason?: string;
};

export function useDistributionLog(
  products: Product[],
  sessionStoreId: string | null,
) {
  const [loggedItems, setLoggedItems] = useState<LoggedItem[]>(() =>
    sessionStoreId ? SalesDao.getBySessionStoreId(sessionStoreId) : [],
  );

  const logItem = useCallback(
    (productId: string, qty: number, boQty: number, boReason?: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product || (qty === 0 && boQty === 0) || !sessionStoreId) return;

      const saleId = SalesDao.insertSale(
        sessionStoreId,
        product.id,
        product.price,
        qty,
        boQty,
        boReason ?? "",
      );

      setLoggedItems((prev) => [
        ...prev,
        {
          saleId,
          productId: product.id,
          productName: product.name,
          price: product.price,
          qty,
          boQty,
          boReason,
        },
      ]);
    },
    [products, sessionStoreId],
  );

  const updateItemQty = useCallback((index: number, delta: number) => {
    setLoggedItems((prev) => {
      const item = prev[index];
      if (!item) return prev;
      const newQty = Math.max(0, item.qty + delta);
      if (sessionStoreId) {
        if (newQty === 0 && item.boQty === 0) {
          SalesDao.deleteSale(item.saleId);
        } else {
          SalesDao.updateSale(item.saleId, item.productId, item.price, newQty, item.boQty, item.boReason ?? "");
        }
      }
      return prev
        .map((it, i) => (i !== index ? it : { ...it, qty: newQty }))
        .filter((it) => it.qty > 0 || it.boQty > 0);
    });
  }, [sessionStoreId]);

  const removeItem = useCallback((index: number) => {
    setLoggedItems((prev) => {
      const item = prev[index];
      if (item && sessionStoreId) SalesDao.deleteSale(item.saleId);
      return prev.filter((_, i) => i !== index);
    });
  }, [sessionStoreId]);

  const editItem = useCallback(
    (
      index: number,
      productId: string,
      qty: number,
      boQty: number,
      boReason?: string,
    ) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      setLoggedItems((prev) => {
        const item = prev[index];
        if (item && sessionStoreId) {
          if (qty === 0 && boQty === 0) {
            SalesDao.deleteSale(item.saleId);
          } else {
            SalesDao.updateSale(item.saleId, product.id, product.price, qty, boQty, boReason ?? "");
          }
        }
        return prev
          .map((it, i) =>
            i !== index
              ? it
              : {
                  saleId: it.saleId,
                  productId: product.id,
                  productName: product.name,
                  price: product.price,
                  qty,
                  boQty,
                  boReason,
                },
          )
          .filter((it) => it.qty > 0 || it.boQty > 0);
      });
    },
    [products, sessionStoreId],
  );

  return { loggedItems, logItem, updateItemQty, removeItem, editItem };
}
