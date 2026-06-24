import { useState, useCallback } from "react";
import type { Product } from "../types/store-types";
import SessionInventoryDao, {
  type InventoryItem,
} from "@/src/lib/dao/session-inventory-dao";
import * as inventoryService from "../services/inventoryLocalService";

export type { InventoryItem };

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
        inventoryService.updateInventoryQuantity(existing.inventoryId, qty);
        setItems((prev) =>
          prev.map((it) =>
            it.productId === productId ? { ...it, qty } : it,
          ),
        );
        return;
      }

      const inventoryId = inventoryService.createInventory({
        sessionId,
        productId: product.id,
        productName: product.name,
        qty,
      });
      setItems((prev) => [
        ...prev,
        { inventoryId, productId: product.id, productName: product.name, qty },
      ]);
    },
    [products, sessionId, items],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.productId === productId);
      if (item) inventoryService.deleteInventory(item.inventoryId);
      return prev.filter((it) => it.productId !== productId);
    });
  }, []);

  return { items, setItemQty, removeItem };
}
