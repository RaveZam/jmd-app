import { db } from "../db-migration";
import { v4 as uuidv4 } from "uuid";
import { logTable } from "../log-table";

const RoutesDao = {
  getAllRoutes() {
    return db.getAllSync<{ id: string; name: string }>(`SELECT * FROM routes`);
  },

  insertRoute(name: string) {
    const id = uuidv4();
    db.runSync(`INSERT INTO routes (id, name) VALUES (?, ?)`, [id, name]);
    return id;
  },

  renameRoute(id: string, name: string) {
    db.runSync(`UPDATE routes SET name = ? WHERE id = ?`, [name, id]);
  },

  deleteRoute(id: string) {
    db.withTransactionSync(() => {
      db.runSync(
        `DELETE FROM stores WHERE province_id IN (SELECT id FROM provinces WHERE route_id = ?)`,
        [id],
      );
      db.runSync(`DELETE FROM provinces WHERE route_id = ?`, [id]);
      db.runSync(`DELETE FROM routes WHERE id = ?`, [id]);
    });
  },

  logAll() {
    const rows = db.getAllSync<{ id: string; name: string }>(
      `SELECT * FROM routes`,
    );
    logTable("routes", rows as Record<string, unknown>[]);
  },
};

export default RoutesDao;
