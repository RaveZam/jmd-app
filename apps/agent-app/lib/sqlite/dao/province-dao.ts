import { db } from "@/lib/sqlite/db-migration";
import { v4 as uuidv4 } from "uuid";

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
};
export default ProvincesDao;
