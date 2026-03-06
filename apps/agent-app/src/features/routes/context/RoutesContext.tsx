import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Route } from "../types/routes-type";
import { PROVINCES, type Province } from "../types/province";
import { STORES, type Store } from "../types/stores";
import { useEffect } from "react";
import { routesServices } from "../services/routes-services";

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
  const [routes, setRoutes] = useState<Route[]>([]);

  function fetchRoutes() {
    console.log("fetching routes");
    const routes = routesServices.getRoutes();
    setRoutes(routes);
  }

  useEffect(() => {
    fetchRoutes();
  }, []);

  const value = useMemo<RoutesContextValue>(
    () => ({
      routes: routes,
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

export function useStores() {
  const { stores } = useRoutesContext();
  return { stores };
}

export function useProvinces() {
  const { provinces } = useRoutesContext();
  return { provinces };
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
