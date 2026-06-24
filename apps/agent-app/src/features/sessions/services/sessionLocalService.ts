import { getDb } from "@/src/lib/db";
import { enqueueOutbox } from "@/src/lib/sync/outbox";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";
import SessionStoresDao from "@/src/lib/dao/session-stores-dao";
import StoresDao from "@/src/lib/dao/store-dao";
import { generateUUID } from "@/src/lib/uuid";
import { supabase } from "@/src/lib/supabase";
import { getPhTime } from "@/src/shared/helpers/getPhTime";

/**
 * Creates a route session and its planned stores locally, enqueuing each for
 * sync. Returns the new session id.
 */
export async function createSessionWithStores(
  routeId: string,
  routeName: string,
): Promise<string> {
  const sessionDate = getPhTime().toISOString().split("T")[0];
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const conductedBy = session?.user?.id;
  if (!conductedBy) throw new Error("User not authenticated");

  const sessionId = generateUUID();
  const stores = StoresDao.getStoresForRoute(routeId);
  const createdAt = getPhTime().toISOString();

  getDb().withTransactionSync(() => {
    RouteSessionsDao.insert(routeName, sessionDate, conductedBy, sessionId);
    enqueueOutbox({
      entityType: "route_session",
      entityId: sessionId,
      operation: "create",
      payload: {
        id: sessionId,
        route_name: routeName,
        session_date: sessionDate,
        conducted_by: conductedBy,
        status: "ongoing",
        created_at: createdAt,
      },
    });

    for (const store of stores) {
      const sessionStoreId = SessionStoresDao.insert(sessionId, store.id);
      enqueueOutbox({
        entityType: "session_store",
        entityId: sessionStoreId,
        operation: "create",
        payload: {
          id: sessionStoreId,
          route_session_id: sessionId,
          store_id: store.id,
          visited: false,
          created_at: createdAt,
        },
      });
    }
  });

  return sessionId;
}

export function completeSession(sessionId: string): void {
  getDb().withTransactionSync(() => {
    RouteSessionsDao.complete(sessionId);
    const row = RouteSessionsDao.getById(sessionId);
    if (row) {
      enqueueOutbox({
        entityType: "route_session",
        entityId: sessionId,
        operation: "create", // upsert the full, now-completed row
        payload: row,
      });
    }
  });
}
