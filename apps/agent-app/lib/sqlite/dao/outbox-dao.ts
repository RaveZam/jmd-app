import { db } from "../db-migration";
import { v4 as uuidv4 } from "uuid";
import { getPhTime } from "@/helpers/getPhTime";
import { logTable } from "../log-table";

const OutboxDao = {
  insertOutbox(type: string, payload: string, priority: number) {
    const id = uuidv4();

    db.runSync(
      `INSERT INTO outbox (id, type, payload, priority, created_at, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, type, payload, priority, getPhTime().getTime(), "pending"],
    );
    return id;
  },

  logAll() {
    const rows = db.getAllSync<{
      id: string;
      type: string;
      payload: string;
      priority: number;
      created_at: number;
      status: string;
    }>(`SELECT * FROM outbox`);
    logTable("outbox", rows as Record<string, unknown>[]);
  },
};

export default OutboxDao;
