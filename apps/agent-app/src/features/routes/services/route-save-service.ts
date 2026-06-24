import { getDb } from "@/src/lib/db";
import RoutesDao from "@/src/lib/dao/routes-dao";
import ProvincesDao from "@/src/lib/dao/province-dao";
import StoresDao from "@/src/lib/dao/store-dao";
import type { CreateRouteDraft } from "../types/routes-type";

export const routeSaveService = {
  createRouteFromDraft(draft: CreateRouteDraft) {
    const trimmedRouteName = draft.name.trim();

    if (!trimmedRouteName) {
      throw new Error("Route name is required.");
    }

    if (draft.provinces.length === 0) {
      throw new Error("Add at least one province.");
    }

    getDb().withTransactionSync(() => {
      const routeId = RoutesDao.insertRoute(trimmedRouteName);

      draft.provinces.forEach((province) => {
        const provinceName = province.name.trim();

        if (!provinceName) return;

        const provinceId = ProvincesDao.insertProvince(routeId, provinceName);

        province.stores.forEach((store) => {
          const storeName = store.name.trim();

          if (!storeName) return;

          StoresDao.insertStore({
            provinceId: provinceId,
            name: storeName,
            province: store.province?.trim() ?? "",
            city: store.city?.trim() ?? "",
            barangay: store.barangay?.trim() ?? "",
            contactName: store.contactName?.trim() ?? "",
            contactPhone: store.contactPhone?.trim() ?? "",
          });
        });
      });
    });

    return RoutesDao.getAllRoutes();
  },
};
