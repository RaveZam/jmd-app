import { useState, useMemo, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { ProductsDao } from "@/src/lib/dao/products-dao";
import SessionInventoryDao from "@/src/lib/dao/session-inventory-dao";
import { markStoreVisited } from "../services/visitLocalService";
import { useDistributionLog } from "./useDistributionLog";
import { computeSummary } from "../helpers/distribution-helpers";

export function useStorePage() {
  const params = useLocalSearchParams<{
    storeId?: string;
    storeName?: string;
    storeProvince?: string;
    storeCity?: string;
    storeBarangay?: string;
    contactName?: string;
    provinceName?: string;
    sessionStoreId?: string;
  }>();

  const storeName =
    typeof params.storeName === "string" ? params.storeName : null;
  const storeBarangay =
    typeof params.storeBarangay === "string" ? params.storeBarangay : "";
  const storeCity =
    typeof params.storeCity === "string" ? params.storeCity : "";
  const provinceName =
    typeof params.provinceName === "string" ? params.provinceName : "";
  const location = [storeBarangay, storeCity, provinceName]
    .filter(Boolean)
    .join(", ");

  const sessionStoreId =
    typeof params.sessionStoreId === "string" ? params.sessionStoreId : null;

  const products = useMemo(() => ProductsDao.getAllProducts(), []);
  const { loggedItems, logItem, updateItemQty, removeItem, editItem } =
    useDistributionLog(products, sessionStoreId);

  const [showSoldAdder, setShowSoldAdder] = useState(false);

  const soldItems = loggedItems.map((item, idx) => ({ item, idx }));
  const summary = computeSummary(loggedItems);

  const remainingByProduct = useMemo(
    () =>
      sessionStoreId
        ? SessionInventoryDao.getRemainingBySessionStoreId(sessionStoreId)
        : {},
    [sessionStoreId, loggedItems],
  );

  const confirmVisit = useCallback(() => {
    if (!sessionStoreId) return;
    markStoreVisited(sessionStoreId);
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
    remainingByProduct,
    showSoldAdder,
    setShowSoldAdder,
    confirmVisit,
  };
}
