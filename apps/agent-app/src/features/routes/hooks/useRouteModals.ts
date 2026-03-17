import { useState } from "react";
import { ProvinceRow, StoreRow } from "../types/db-rows";

export function useRouteModals() {
  const [showAddProvince, setShowAddProvince] = useState(false);
  const [addStoreForProvince, setAddStoreForProvince] =
    useState<ProvinceRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<StoreRow | null>(null);
  const [pendingDeleteProvince, setPendingDeleteProvince] =
    useState<ProvinceRow | null>(null);
  const [viewStore, setViewStore] = useState<StoreRow | null>(null);
  const [editStore, setEditStore] = useState<{
    store: StoreRow;
    province: ProvinceRow;
  } | null>(null);

  return {
    showAddProvince,
    setShowAddProvince,
    addStoreForProvince,
    setAddStoreForProvince,
    pendingDelete,
    setPendingDelete,
    pendingDeleteProvince,
    setPendingDeleteProvince,
    viewStore,
    setViewStore,
    editStore,
    setEditStore,
  };
}
