import { db } from "@/lib/sqlite/db-migration";
import RoutesDao from "@/lib/sqlite/dao/routes-dao";
import ProvincesDao from "@/lib/sqlite/dao/province-dao";
import StoresDao from "@/lib/sqlite/dao/store-dao";
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

    const routesDao = new RoutesDao();

    db.withTransactionSync(() => {
      const routeId = routesDao.insertRoute(trimmedRouteName);

      draft.provinces.forEach((province) => {
        const provinceName = province.name.trim();

        if (!provinceName) return;

        const provinceId = ProvincesDao.insertProvince(routeId!, provinceName);

        province.stores.forEach((store) => {
          const storeName = store.name.trim();

          if (!storeName) return;

          StoresDao.insertStore({
            provinceId: provinceId!,
            name: storeName,
            address: store.address.trim(),
            contactName: store.contactName.trim(),
            contactPhone: store.contactPhone.trim(),
          });
        });
      });
    });

    return routesDao.getAllRoutes();
  },
};
