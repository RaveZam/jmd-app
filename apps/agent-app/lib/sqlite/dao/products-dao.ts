import { db } from "../db-migration";
import { logTable } from "../log-table";

export const ProductsDao = {
  getAllProducts() {
    return db.getAllSync<{ id: string; name: string; price: number }>(
      `SELECT * FROM products`,
    );
  },

  insertProduct(id: string, name: string, price: number) {
    db.runSync(`INSERT INTO products (id, name, price) VALUES (?, ?, ?)`, [
      id,
      name,
      price,
    ]);
  },

  upsertProduct(id: string, name: string, price: number) {
    db.runSync(
      `INSERT OR REPLACE INTO products (id, name, price) VALUES (?, ?, ?)`,
      [id, name, price],
    );
  },

  logAll() {
    const rows = db.getAllSync<{ id: string; name: string; price: number }>(
      `SELECT * FROM products`,
    );
    logTable("products", rows as Record<string, unknown>[]);
  },
};
