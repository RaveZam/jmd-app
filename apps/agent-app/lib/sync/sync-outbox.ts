import OutboxDao from "../sqlite/dao/outbox-dao";
import { supabase } from "../supabase";
import { checkWifi } from "../hooks/wifi-checker";

const TABLE_MAP: Record<string, string> = {
  STORE_ADDED: "stores",
  STORE_UPDATED: "stores",
  PLANNED_ROUTE_CREATED: "planned_routes",
  SESSION_PLAN_CREATED: "route_sessions",
  SESSION_STORE_ADDED: "session_stores",
};

export async function syncOutbox(): Promise<{
  synced: number;
  failed: number;
  total: number;
}> {
  const isConnected = await checkWifi();

  if (!isConnected) {
    console.warn("No internet connection");
    return { synced: 0, failed: 0, total: 0 };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    console.warn("No active session — skipping sync");
    return { synced: 0, failed: 0, total: 0 };
  }

  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  const pending = OutboxDao.getPendingOutbox();

  let lastFailedPriority: number | null = null;
  let synced = 0;
  let failed = 0;

  for (const entry of pending) {
    // if a higher priority failed, skip everything at lower priorities
    if (lastFailedPriority !== null && entry.priority > lastFailedPriority) {
      console.warn(
        `Skipping entry ${entry.id} — priority ${entry.priority} blocked by failed priority ${lastFailedPriority}`,
      );
      continue;
    }

    const table = TABLE_MAP[entry.type];

    if (!table) {
      console.warn(`Unknown outbox type: ${entry.type}`);
      continue;
    }

    try {
      const payload = JSON.parse(entry.payload);

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      console.log(
        `[sync] session before upsert (entry ${entry.id}):`,
        currentSession?.user?.id ?? "null",
      );

      const { error } = await supabase.from(table).upsert(payload);

      if (error) throw error;

      OutboxDao.updateOutboxStatus(entry.id, "synced");
      synced++;
    } catch (err) {
      console.error(`Failed to sync outbox entry ${entry.id}:`, err);
      OutboxDao.updateOutboxStatus(entry.id, "failed");
      failed++;

      if (lastFailedPriority === null) {
        lastFailedPriority = entry.priority;
      }
    }
  }

  console.log(
    `Sync complete: ${synced}/${synced + failed} synced, ${failed} failed`,
  );
  return { synced, failed, total: synced + failed };
}
