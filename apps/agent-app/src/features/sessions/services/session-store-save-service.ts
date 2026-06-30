import { enqueueOutbox } from "@/src/lib/sync/outbox";
import SessionStoresDao from "@/src/lib/dao/session-stores-dao";
import { generateUUID } from "@/src/lib/uuid";

type StoreRef = {
  id: string;
  province_id: string;
};

type InsertSessionStoreInput = {
  sessionId: string;
  store: StoreRef;
  createdAt: string;
};

// Must be called inside a withTransactionSync block — has no transaction of its own.
export function insertSessionStore(input: InsertSessionStoreInput): void {
  const id = generateUUID();
  SessionStoresDao.insert(
    input.sessionId,
    input.store.id,
    input.store.province_id,
    id,
  );
  enqueueOutbox({
    entityType: "session_store",
    entityId: id,
    operation: "create",
    payload: {
      id,
      route_session_id: input.sessionId,
      store_id: input.store.id,
      province_id: input.store.province_id,
      visited: false,
      created_at: input.createdAt,
    },
  });
}
