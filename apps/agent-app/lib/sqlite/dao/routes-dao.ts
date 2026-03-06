import { db } from "../db-migration";

export default class RoutesDao {
  getAllRoutes() {
    return db.execSync(`SELECT * FROM routes`);
  }

  insertRoute(id: string, name: string) {
    db.runSync(`INSERT INTO routes (id, name) VALUES (?, ?)`, [id, name]);
  }
}
