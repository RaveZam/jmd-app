import { getDb } from "@/src/lib/db";
import { enqueueOutbox } from "@/src/lib/sync/outbox";
import SessionStoresDao from "@/src/lib/dao/session-stores-dao";

export function markStoreVisited(sessionStoreId: string): void {
  getDb().withTransactionSync(() => {
    SessionStoresDao.markVisited(sessionStoreId);
    enqueueOutbox({
      entityType: "session_store",
      entityId: sessionStoreId,
      operation: "update",
      payload: { visited: true },
    });
  });
}
