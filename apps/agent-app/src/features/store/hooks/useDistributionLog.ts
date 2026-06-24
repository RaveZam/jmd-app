import { useState, useCallback } from "react";
import type { Product } from "../types/store-types";
import SalesDao, { type LoggedItem } from "@/src/lib/dao/sales-dao";
import * as salesService from "../services/salesLocalService";

export type { LoggedItem };

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

      const saleId = salesService.logSale({
        sessionStoreId,
        productId: product.id,
        productName: product.name,
        price: product.price,
        qty,
        boQty,
        boReason: boReason ?? "",
      });

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

  const updateItemQty = useCallback(
    (index: number, delta: number) => {
      if (!sessionStoreId) return;
      setLoggedItems((prev) => {
        const item = prev[index];
        if (!item) return prev;
        const newQty = Math.max(0, item.qty + delta);

        if (newQty === 0 && item.boQty === 0) {
          salesService.deleteSale(item.saleId);
        } else {
          salesService.updateSale(item.saleId, {
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            qty: newQty,
            boQty: item.boQty,
            boReason: item.boReason ?? "",
          });
        }

        return prev
          .map((it, i) => (i !== index ? it : { ...it, qty: newQty }))
          .filter((it) => it.qty > 0 || it.boQty > 0);
      });
    },
    [sessionStoreId],
  );

  const removeItem = useCallback(
    (index: number) => {
      if (!sessionStoreId) return;
      setLoggedItems((prev) => {
        const item = prev[index];
        if (item) salesService.deleteSale(item.saleId);
        return prev.filter((_, i) => i !== index);
      });
    },
    [sessionStoreId],
  );

  const editItem = useCallback(
    (
      index: number,
      productId: string,
      qty: number,
      boQty: number,
      boReason?: string,
    ) => {
      const product = products.find((p) => p.id === productId);
      if (!product || !sessionStoreId) return;
      setLoggedItems((prev) => {
        const item = prev[index];
        if (item) {
          if (qty === 0 && boQty === 0) {
            salesService.deleteSale(item.saleId);
          } else {
            salesService.updateSale(item.saleId, {
              productId: product.id,
              productName: product.name,
              price: product.price,
              qty,
              boQty,
              boReason: boReason ?? "",
            });
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
