import SessionStoresDao from "@/lib/sqlite/dao/session-stores-dao";

export function createPlannedStores(sessionId: string, storeIds: string[]) {
  storeIds.forEach((storeId) => {
    SessionStoresDao.insert(sessionId, storeId);
  });
}
