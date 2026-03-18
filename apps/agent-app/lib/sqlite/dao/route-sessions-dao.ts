import { db } from "../db-migration";
import { v4 as uuidv4 } from "uuid";
import { logTable } from "../log-table";

const RouteSessionsDao = {
  insert(routeName: string, sessionDate: string, conductedBy: string): string {
    const id = uuidv4();
    db.runSync(
      `INSERT INTO route_sessions (id, route_name, session_date, conducted_by, status) VALUES (?, ?, ?, ?, 'ongoing')`,
      [id, routeName, sessionDate, conductedBy],
    );
    return id;
  },

  logAll() {
    const rows = db.getAllSync<{
      id: string;
      route_name: string;
      session_date: string;
      conducted_by: string;
      status: string;
      created_at: string;
    }>(`SELECT * FROM route_sessions`);
    logTable("route_sessions", rows as Record<string, unknown>[]);
  },
};

export default RouteSessionsDao;
