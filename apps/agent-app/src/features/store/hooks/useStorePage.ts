import { useState, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { ProductsDao } from "@/lib/sqlite/dao/products-dao";
import { useDistributionLog } from "./useDistributionLog";
import {
  getSoldItems,
  getBadItems,
  computeSummary,
} from "../helpers/distribution-helpers";

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

  const products = useMemo(() => ProductsDao.getAllProducts(), []);
  const { loggedItems, logItem, updateItemQty, removeItem } =
    useDistributionLog(products);

  const [showSoldAdder, setShowSoldAdder] = useState(false);
  const [showBadAdder, setShowBadAdder] = useState(false);

  const soldItems = getSoldItems(loggedItems);
  const badItems = getBadItems(loggedItems);
  const summary = computeSummary(loggedItems);

  return {
    storeName,
    location,
    products,
    loggedItems,
    logItem,
    updateItemQty,
    removeItem,
    soldItems,
    badItems,
    summary,
    showSoldAdder,
    setShowSoldAdder,
    showBadAdder,
    setShowBadAdder,
  };
}
