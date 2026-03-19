import { db } from "../db-migration";
import { v4 as uuidv4 } from "uuid";
import { logTable } from "../log-table";

const SessionStoresDao = {
  insert(routeSessionId: string, storeId: string): string {
    const id = uuidv4();
    db.runSync(
      `INSERT INTO session_stores (id, route_session_id, store_id) VALUES (?, ?, ?)`,
      [id, routeSessionId, storeId],
    );
    return id;
  },

  getBySessionId(sessionId: string) {
    return db.getAllSync<{
      id: string;
      route_session_id: string;
      store_id: string;
      store_name: string;
      store_address: string | null;
      store_contact_name: string | null;
      province_name: string | null;
      visited: number;
      created_at: string;
    }>(
      `SELECT ss.*, s.name as store_name, s.address as store_address,
              s.contact_name as store_contact_name, p.name as province_name
       FROM session_stores ss
       INNER JOIN stores s ON ss.store_id = s.id
       LEFT JOIN provinces p ON s.province_id = p.id
       WHERE ss.route_session_id = ?`,
      [sessionId],
    );
  },

  markVisited(sessionStoreId: string) {
    db.runSync(`UPDATE session_stores SET visited = 1 WHERE id = ?`, [
      sessionStoreId,
    ]);
  },

  logAll() {
    const rows = db.getAllSync<{
      id: string;
      route_session_id: string;
      store_id: string;
      visited: number;
      created_at: string;
    }>(`SELECT * FROM session_stores`);
    logTable("session_stores", rows as Record<string, unknown>[]);
  },
};

export default SessionStoresDao;
