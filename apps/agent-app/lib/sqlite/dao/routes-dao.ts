import { db } from "../db-migration";
import { v4 as uuidv4 } from "uuid";

export default class RoutesDao {
  getAllRoutes() {
    return db.getAllSync<{ id: string; name: string }>(`SELECT * FROM routes`);
  }

  insertRoute(name: string) {
    const id = uuidv4();
    db.runSync(`INSERT INTO routes (id, name) VALUES (?, ?)`, [id, name]);
    return id;
  }

  deleteRoute(id: string) {
    db.withTransactionSync(() => {
      db.runSync(`DELETE FROM stores WHERE province_id IN (SELECT id FROM provinces WHERE route_id = ?)`, [id]);
      db.runSync(`DELETE FROM provinces WHERE route_id = ?`, [id]);
      db.runSync(`DELETE FROM routes WHERE id = ?`, [id]);
    });
  }
}
