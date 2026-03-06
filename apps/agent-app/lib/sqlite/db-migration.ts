import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("routeledger.db");

export function initDb() {
  db.execSync(`
     CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS provinces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  route_id TEXT NOT NULL,
  FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province_id TEXT NOT NULL,
  address TEXT,
  contact_number TEXT,
  contact_name TEXT,
  FOREIGN KEY (province_id) REFERENCES provinces(id)
);


    `);
}
