import { useState, useMemo, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { ProductsDao } from "@/lib/sqlite/dao/products-dao";
import SessionStoresDao from "@/lib/sqlite/dao/session-stores-dao";
import OutboxDao from "@/lib/sqlite/dao/outbox-dao";
import { useDistributionLog } from "./useDistributionLog";
import { computeSummary } from "../helpers/distribution-helpers";

export function useStorePage() {
  const params = useLocalSearchParams<{
    storeId?: string;
    storeName?: string;
    storeAddress?: string;
    contactName?: string;
    provinceName?: string;
    sessionStoreId?: string;
  }>();

  const storeName =
    typeof params.storeName === "string" ? params.storeName : null;
  const storeAddress =
    typeof params.storeAddress === "string" ? params.storeAddress : "";
  const provinceName =
    typeof params.provinceName === "string" ? params.provinceName : "";
  const location = provinceName
    ? `${provinceName}  •  ${storeAddress}`
    : storeAddress;

  const sessionStoreId =
    typeof params.sessionStoreId === "string" ? params.sessionStoreId : null;

  const products = useMemo(() => ProductsDao.getAllProducts(), []);
  const { loggedItems, logItem, updateItemQty, removeItem, editItem } =
    useDistributionLog(products, sessionStoreId);

  const [showSoldAdder, setShowSoldAdder] = useState(false);

  const soldItems = loggedItems.map((item, idx) => ({ item, idx }));
  const summary = computeSummary(loggedItems);

  const confirmVisit = useCallback(() => {
    if (!sessionStoreId) return;
    SessionStoresDao.markVisited(sessionStoreId);
    OutboxDao.insertOutbox(
      "SESSION_STORE_VISITED",
      JSON.stringify({ id: sessionStoreId, visited: true }),
      5,
    );
    router.back();
  }, [sessionStoreId]);

  return {
    storeName,
    location,
    products,
    loggedItems,
    logItem,
    updateItemQty,
    removeItem,
    editItem,
    soldItems,
    summary,
    showSoldAdder,
    setShowSoldAdder,
    confirmVisit,
  };
}
