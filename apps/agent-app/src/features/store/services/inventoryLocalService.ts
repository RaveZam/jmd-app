import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";
import { enqueueOutbox } from "@/src/lib/sync/outbox";
import SessionInventoryDao from "@/src/lib/dao/session-inventory-dao";
import { getPhTime } from "@/src/shared/helpers/getPhTime";

/** Create a morning-inventory row + enqueue. Returns the new inventory id. */
export function createInventory(input: {
  sessionId: string;
  productId: string;
  productName: string;
  qty: number;
}): string {
  const id = generateUUID();
  getDb().withTransactionSync(() => {
    SessionInventoryDao.insert(
      input.sessionId,
      input.productId,
      input.productName,
      input.qty,
      id,
    );
    enqueueOutbox({
      entityType: "session_inventory",
      entityId: id,
      operation: "create",
      payload: {
        id,
        route_session_id: input.sessionId,
        product_id: input.productId,
        snapshot_product_name: input.productName,
        quantity: input.qty,
        created_at: getPhTime().toISOString(),
      },
    });
  });
  return id;
}

export function updateInventoryQuantity(inventoryId: string, qty: number): void {
  getDb().withTransactionSync(() => {
    SessionInventoryDao.updateQuantity(inventoryId, qty);
    enqueueOutbox({
      entityType: "session_inventory",
      entityId: inventoryId,
      operation: "update",
      payload: { quantity: qty },
    });
  });
}

export function deleteInventory(inventoryId: string): void {
  getDb().withTransactionSync(() => {
    SessionInventoryDao.delete(inventoryId);
    enqueueOutbox({
      entityType: "session_inventory",
      entityId: inventoryId,
      operation: "delete",
      payload: { id: inventoryId },
    });
  });
}
