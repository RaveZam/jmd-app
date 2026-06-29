// Test-only stand-in for expo-sqlite. The real module needs native bindings
// that don't exist under Jest, so integration tests back getDb() with an
// in-memory database from Node's built-in `node:sqlite` (Node 22.5+). It
// implements just the sync surface our DAOs/services use, with the same
// semantics as expo-sqlite (getFirstSync -> null when no row, etc.).
//
// Jest auto-uses this for any test that imports "expo-sqlite" because it lives
// in <rootDir>/__mocks__ for a node_modules package. One in-memory DB is shared
// per test file (Jest gives each file a fresh module registry), so create the
// schema once in beforeAll and clear rows in beforeEach (see db-test-helpers).
const { DatabaseSync } = require("node:sqlite");

function bind(params) {
  // expo-sqlite takes a params array; node:sqlite takes spread anonymous params.
  return Array.isArray(params) ? params : [];
}

function wrap(db) {
  return {
    execAsync(sql) {
      db.exec(sql);
      return Promise.resolve();
    },
    runSync(sql, params) {
      const result = db.prepare(sql).run(...bind(params));
      return {
        changes: Number(result.changes),
        lastInsertRowId: Number(result.lastInsertRowid),
      };
    },
    getAllSync(sql, params) {
      return db.prepare(sql).all(...bind(params));
    },
    getFirstSync(sql, params) {
      const row = db.prepare(sql).get(...bind(params));
      return row === undefined ? null : row;
    },
    withTransactionSync(fn) {
      db.exec("BEGIN");
      try {
        fn();
        db.exec("COMMIT");
      } catch (err) {
        db.exec("ROLLBACK");
        throw err;
      }
    },
  };
}

let wrapped = null;

function openDatabaseSync() {
  if (!wrapped) {
    wrapped = wrap(new DatabaseSync(":memory:"));
  }
  return wrapped;
}

module.exports = { openDatabaseSync };
