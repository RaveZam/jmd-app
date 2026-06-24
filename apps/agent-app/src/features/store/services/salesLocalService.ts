import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";
import { enqueueOutbox } from "@/src/lib/sync/outbox";
import SalesDao from "@/src/lib/dao/sales-dao";
import { getPhTime } from "@/src/shared/helpers/getPhTime";

type SaleInput = {
  sessionStoreId: string;
  productId: string;
  productName: string;
  price: number;
  qty: number;
  boQty: number;
  boReason: string;
};

/** Local write + outbox enqueue, in one transaction. Returns the new sale id. */
export function logSale(input: SaleInput): string {
  const id = generateUUID();
  getDb().withTransactionSync(() => {
    SalesDao.insertSale(
      id,
      input.sessionStoreId,
      input.productId,
      input.productName,
      input.price,
      input.qty,
      input.boQty,
      input.boReason,
    );
    enqueueOutbox({
      entityType: "sale",
      entityId: id,
      operation: "create",
      payload: {
        id,
        session_store_id: input.sessionStoreId,
        product_id: input.productId,
        snapshot_product_name: input.productName,
        snapshot_price: input.price,
        quantity_sold: input.qty,
        quantity_bo: input.boQty,
        bo_reason: input.boReason,
        created_at: getPhTime().toISOString(),
      },
    });
  });
  return id;
}

export function updateSale(
  saleId: string,
  input: Omit<SaleInput, "sessionStoreId">,
): void {
  getDb().withTransactionSync(() => {
    SalesDao.updateSale(
      saleId,
      input.productId,
      input.productName,
      input.price,
      input.qty,
      input.boQty,
      input.boReason,
    );
    enqueueOutbox({
      entityType: "sale",
      entityId: saleId,
      operation: "update",
      payload: {
        product_id: input.productId,
        snapshot_product_name: input.productName,
        snapshot_price: input.price,
        quantity_sold: input.qty,
        quantity_bo: input.boQty,
        bo_reason: input.boReason,
      },
    });
  });
}

export function deleteSale(saleId: string): void {
  getDb().withTransactionSync(() => {
    SalesDao.deleteSale(saleId);
    enqueueOutbox({
      entityType: "sale",
      entityId: saleId,
      operation: "delete",
      payload: { id: saleId },
    });
  });
}
