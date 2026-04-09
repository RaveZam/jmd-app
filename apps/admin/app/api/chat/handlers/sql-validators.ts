export function validateSql(sql: string): string | null {
  const normalized = sql.trim().toLowerCase();

  if (!normalized.startsWith("select")) {
    return "Only SELECT statements are allowed.";
  }

  const forbidden = ["insert", "update", "delete", "drop", "alter", "truncate"];
  for (const keyword of forbidden) {
    if (normalized.includes(keyword)) {
      return `Forbidden keyword detected: ${keyword}`;
    }
  }

  const blockedTables = ["users", "auth.users", "pg_", "information_schema"];
  for (const table of blockedTables) {
    if (normalized.includes(table)) {
      return `Table not allowed: ${table}`;
    }
  }

  const allowedTables = [
    "products",
    "stores",
    "route_sessions",
    "session_stores",
    "sales",
  ];
  // Basic check — the real safety net is execute_readonly_query on the DB side
  const mentionedTables = allowedTables.filter((t) => normalized.includes(t));
  if (mentionedTables.length === 0) {
    return "Query must reference at least one allowed table.";
  }

  return null; // valid
}
