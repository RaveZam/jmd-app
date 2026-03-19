import { db } from "../db-migration";
import { logTable } from "../log-table";
import { v4 as uuidv4 } from "uuid";
import type { LoggedItem } from "@/src/features/store/hooks/useDistributionLog";

const SalesDao = {
  getBySessionStoreId(sessionStoreId: string): LoggedItem[] {
    const rows = db.getAllSync<{
      id: string;
      product_id: string;
      product_name: string;
      snapshot_price: number;
      quantity_sold: number;
      quantity_bo: number;
      bo_reason: string | null;
    }>(
      `SELECT s.id, s.product_id, p.name AS product_name, s.snapshot_price,
              s.quantity_sold, s.quantity_bo, s.bo_reason
       FROM sales s
       JOIN products p ON s.product_id = p.id
       WHERE s.session_store_id = ?
       ORDER BY s.created_at ASC`,
      [sessionStoreId],
    );
    return rows.map((r) => ({
      saleId: r.id,
      productId: r.product_id,
      productName: r.product_name,
      price: r.snapshot_price,
      qty: r.quantity_sold,
      boQty: r.quantity_bo,
      boReason: r.bo_reason ?? undefined,
    }));
  },

  insertSale(
    sessionStoreId: string,
    productId: string,
    snapshotPrice: number,
    quantitySold: number,
    quantityBo: number,
    boReason: string,
  ) {
    const id = uuidv4();
    db.runSync(
      `INSERT INTO sales (id, session_store_id, product_id, snapshot_price, quantity_sold, quantity_bo, bo_reason) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        sessionStoreId,
        productId,
        snapshotPrice,
        quantitySold,
        quantityBo,
        boReason,
      ],
    );
    return id;
  },

  updateSale(
    saleId: string,
    productId: string,
    snapshotPrice: number,
    quantitySold: number,
    quantityBo: number,
    boReason: string,
  ) {
    db.runSync(
      `UPDATE sales SET product_id = ?, snapshot_price = ?, quantity_sold = ?, quantity_bo = ?, bo_reason = ? WHERE id = ?`,
      [productId, snapshotPrice, quantitySold, quantityBo, boReason, saleId],
    );
  },

  deleteSale(saleId: string) {
    db.runSync(`DELETE FROM sales WHERE id = ?`, [saleId]);
  },

  logAll() {
    const rows = db.getAllSync<{
      id: string;
      session_store_id: string;
      product_id: string;
      snapshot_price: number;
      quantity_sold: number;
      quantity_bo: number;
      bo_reason: string | null;
      created_at: string;
    }>(`SELECT * FROM sales`);
    logTable("sales", rows as Record<string, unknown>[]);
  },
};

export default SalesDao;
