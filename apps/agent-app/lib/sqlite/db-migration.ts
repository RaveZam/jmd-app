import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("routeledger-v1.2.db");

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
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  barangay TEXT NOT NULL,
  contact_number TEXT,
  contact_name TEXT,
  FOREIGN KEY (province_id) REFERENCES provinces(id)
);

CREATE TABLE IF NOT EXISTS route_sessions (
    id          TEXT PRIMARY KEY,               
    route_name  TEXT NOT NULL,
    session_date TEXT NOT NULL,                 
    conducted_by TEXT NOT NULL,                
    status      TEXT NOT NULL DEFAULT 'ongoing' CHECK(status IN ('ongoing', 'completed')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS session_stores (
    id                TEXT PRIMARY KEY,        
    route_session_id  TEXT NOT NULL REFERENCES route_sessions(id) ON DELETE CASCADE,
    store_id          TEXT NOT NULL,
    visited           INTEGER NOT NULL DEFAULT 0, 
    created_at        TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(route_session_id, store_id)
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL
  );

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  session_store_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  snapshot_name TEXT NOT NULL,
  snapshot_price REAL NOT NULL,
  quantity_sold INTEGER NOT NULL DEFAULT 0,
  quantity_bo INTEGER NOT NULL DEFAULT 0,
  bo_reason TEXT,
  total REAL GENERATED ALWAYS AS (snapshot_price * quantity_sold) VIRTUAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_store_id) REFERENCES session_stores(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS outbox (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,       
  payload TEXT NOT NULL,    
  priority INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  status TEXT DEFAULT 'pending'
);


    `);
}
