import { useState, useCallback } from "react";
import type { Product } from "../types/store-types";
import SalesDao from "@/lib/sqlite/dao/sales-dao";
import OutboxDao from "@/lib/sqlite/dao/outbox-dao";
import { getPhTime } from "@/helpers/getPhTime";

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

      OutboxDao.insertOutbox(
        "SALE_CREATED",
        JSON.stringify({
          id: saleId,
          session_store_id: sessionStoreId,
          product_id: product.id,
          snapshot_price: product.price,
          quantity_sold: qty,
          quantity_bo: boQty,
          bo_reason: boReason ?? "",
          created_at: getPhTime().toISOString(),
        }),
        4,
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
          OutboxDao.insertOutbox(
            "SALE_DELETED",
            JSON.stringify({ id: item.saleId }),
            4,
          );
        } else {
          SalesDao.updateSale(item.saleId, item.productId, item.price, newQty, item.boQty, item.boReason ?? "");
          OutboxDao.insertOutbox(
            "SALE_UPDATED",
            JSON.stringify({
              id: item.saleId,
              product_id: item.productId,
              snapshot_price: item.price,
              quantity_sold: newQty,
              quantity_bo: item.boQty,
              bo_reason: item.boReason ?? "",
            }),
            4,
          );
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
      if (item && sessionStoreId) {
        SalesDao.deleteSale(item.saleId);
        OutboxDao.insertOutbox(
          "SALE_DELETED",
          JSON.stringify({ id: item.saleId }),
          4,
        );
      }
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
            OutboxDao.insertOutbox(
              "SALE_DELETED",
              JSON.stringify({ id: item.saleId }),
              4,
            );
          } else {
            SalesDao.updateSale(item.saleId, product.id, product.price, qty, boQty, boReason ?? "");
            OutboxDao.insertOutbox(
              "SALE_UPDATED",
              JSON.stringify({
                id: item.saleId,
                product_id: product.id,
                snapshot_price: product.price,
                quantity_sold: qty,
                quantity_bo: boQty,
                bo_reason: boReason ?? "",
              }),
              4,
            );
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
