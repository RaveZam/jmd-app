import { db } from "@/lib/sqlite/db-migration";
import { v4 as uuidv4 } from "uuid";
import { logTable } from "@/lib/sqlite/log-table";

const ProvincesDao = {
  insertProvince(routeId: string, name: string) {
    const id = uuidv4();
    db.runSync(`INSERT INTO provinces (id, route_id, name) VALUES (?, ?, ?)`, [
      id,
      routeId,
      name,
    ]);
    return id;
  },

  deleteProvince(id: string) {
    db.runSync(`DELETE FROM stores WHERE province_id = ?`, [id]);
    db.runSync(`DELETE FROM provinces WHERE id = ?`, [id]);
  },

  getProvincesForRoute(routeId: string) {
    return db.getAllSync<{ id: string; name: string; route_id: string }>(
      `SELECT * FROM provinces WHERE route_id = ?`,
      [routeId]
    );
  },

  logAll() {
    const rows = db.getAllSync<{ id: string; name: string; route_id: string }>(`SELECT * FROM provinces`);
    logTable("provinces", rows as Record<string, unknown>[]);
  },
};
export default ProvincesDao;
