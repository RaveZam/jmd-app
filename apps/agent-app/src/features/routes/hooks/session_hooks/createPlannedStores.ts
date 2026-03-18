import SessionStoresDao from "@/lib/sqlite/dao/session-stores-dao";

export function createPlannedStores(
  sessionId: string,
  storeIds: string[],
): { id: string; storeId: string }[] {
  return storeIds.map((storeId) => ({
    id: SessionStoresDao.insert(sessionId, storeId),
    storeId,
  }));
}
