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
