import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import { ROUTES, type Route } from "../mock/routeslist";
import { PROVINCES, type Province } from "../mock/province";
import { STORES, type Store } from "../mock/stores";

type RoutesContextValue = {
  routes: Route[];
  provinces: Province[];
  stores: Store[];
  getProvincesByRoute: (routeId: string) => Province[];
  getStoresByProvince: (provinceId: string) => Store[];
  getStoresByRoute: (routeId: string) => Store[];
};

const RoutesContext = createContext<RoutesContextValue | undefined>(undefined);

type RoutesProviderProps = {
  children: ReactNode;
};

export function RoutesProvider({ children }: RoutesProviderProps) {
  const value = useMemo<RoutesContextValue>(
    () => ({
      routes: ROUTES,
      provinces: PROVINCES,
      stores: STORES,
      getProvincesByRoute: (routeId: string) =>
        PROVINCES.filter((province) => province.routeId === routeId),
      getStoresByProvince: (provinceId: string) =>
        STORES.filter((store) => store.provinceId === provinceId),
      getStoresByRoute: (routeId: string) => {
        const provincesForRoute = PROVINCES.filter(
          (province) => province.routeId === routeId,
        );

        const provinceIds = provincesForRoute.map((province) => province.id);

        return STORES.filter((store) => provinceIds.includes(store.provinceId));
      },
    }),
    [],
  );

  return (
    <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>
  );
}

function useRoutesContext(): RoutesContextValue {
  const context = useContext(RoutesContext);

  if (!context) {
    throw new Error("useRoutesContext must be used within a RoutesProvider");
  }

  return context;
}

export function useRoutes() {
  const { routes } = useRoutesContext();

  return { routes };
}

export function useRouteDetail(routeId: string) {
  const { routes, getProvincesByRoute, getStoresByProvince, getStoresByRoute } =
    useRoutesContext();

  const route = routes.find((item) => item.id === routeId) ?? null;
  const provinces = getProvincesByRoute(routeId);
  const stores = getStoresByRoute(routeId);

  return {
    route,
    provinces,
    stores,
    getStoresByProvince,
  };
}
