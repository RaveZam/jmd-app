import { useState, useCallback, useEffect } from "react";
import ProvincesDao from "@/lib/sqlite/dao/province-dao";
import StoresDao from "@/lib/sqlite/dao/store-dao";
import { ProvinceRow, StoreRow } from "../types/db-rows";


export function useProvinces(routeId: string | undefined) {
  const [provinces, setProvinces] = useState<ProvinceRow[]>([]);
  const [storesByProvince, setStoresByProvince] = useState<
    Record<string, StoreRow[]>
  >({});

  const loadProvinces = useCallback(() => {
    if (!routeId) return;
    const loaded = ProvincesDao.getProvincesForRoute(routeId);
    setProvinces(loaded);
    const map: Record<string, StoreRow[]> = {};
    for (const p of loaded) {
      map[p.id] = StoresDao.getStoresForProvince(p.id);
    }
    setStoresByProvince(map);
  }, [routeId]);

  const loadStoresForProvince = useCallback((provinceId: string) => {
    setStoresByProvince((prev) => ({
      ...prev,
      [provinceId]: StoresDao.getStoresForProvince(provinceId),
    }));
  }, []);

  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  const deleteProvince = useCallback(
    (id: string) => {
      ProvincesDao.deleteProvince(id);
      loadProvinces();
    },
    [loadProvinces],
  );

  const deleteStore = useCallback(
    (store: StoreRow) => {
      StoresDao.deleteStore(store.id);
      loadStoresForProvince(store.province_id);
    },
    [loadStoresForProvince],
  );

  return {
    provinces,
    storesByProvince,
    loadProvinces,
    loadStoresForProvince,
    deleteProvince,
    deleteStore,
  };
}
