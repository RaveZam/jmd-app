import { db } from "../db-migration";
import { v4 as uuidv4 } from "uuid";

export default class RoutesDao {
  getAllRoutes() {
    return db.execSync(`SELECT * FROM routes`);
  }

  insertRoute(name: string) {
    const id = uuidv4();
    db.runSync(`INSERT INTO routes (id, name) VALUES (?, ?)`, [id, name]);
  }
}
