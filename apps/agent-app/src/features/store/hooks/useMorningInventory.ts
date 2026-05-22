import { useState, useCallback } from "react";
import type { Product } from "../types/store-types";
import SessionInventoryDao from "@/lib/sqlite/dao/session-inventory-dao";
import OutboxDao from "@/lib/sqlite/dao/outbox-dao";
import { getPhTime } from "@/helpers/getPhTime";

export type InventoryItem = {
  inventoryId: string;
  productId: string;
  productName: string;
  qty: number;
};

export function useMorningInventory(
  products: Product[],
  sessionId: string | null,
) {
  const [items, setItems] = useState<InventoryItem[]>(() =>
    sessionId ? SessionInventoryDao.getBySessionId(sessionId) : [],
  );

  const setItemQty = useCallback(
    (productId: string, qty: number) => {
      if (!sessionId) return;
      const product = products.find((p) => p.id === productId);
      if (!product || qty <= 0) return;

      const existing = items.find((it) => it.productId === productId);
      if (existing) {
        SessionInventoryDao.updateQuantity(existing.inventoryId, qty);
        OutboxDao.insertOutbox(
          "INVENTORY_UPDATED",
          JSON.stringify({ id: existing.inventoryId, quantity: qty }),
          3,
        );
        setItems((prev) =>
          prev.map((it) =>
            it.productId === productId ? { ...it, qty } : it,
          ),
        );
        return;
      }

      const inventoryId = SessionInventoryDao.insert(
        sessionId,
        product.id,
        product.name,
        qty,
      );
      OutboxDao.insertOutbox(
        "INVENTORY_CREATED",
        JSON.stringify({
          id: inventoryId,
          route_session_id: sessionId,
          product_id: product.id,
          snapshot_product_name: product.name,
          quantity: qty,
          created_at: getPhTime().toISOString(),
        }),
        3,
      );
      setItems((prev) => [
        ...prev,
        {
          inventoryId,
          productId: product.id,
          productName: product.name,
          qty,
        },
      ]);
    },
    [products, sessionId, items],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.productId === productId);
      if (item) {
        SessionInventoryDao.delete(item.inventoryId);
        OutboxDao.insertOutbox(
          "INVENTORY_DELETED",
          JSON.stringify({ id: item.inventoryId }),
          3,
        );
      }
      return prev.filter((it) => it.productId !== productId);
    });
  }, []);

  return { items, setItemQty, removeItem };
}
