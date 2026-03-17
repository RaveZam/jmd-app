import { useState, useCallback, useEffect } from "react";
import RoutesDao from "@/lib/sqlite/dao/routes-dao";
import { Route } from "../types/routes-type";

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);

  const loadRoutes = useCallback(() => {
    setRoutes(RoutesDao.getAllRoutes());
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  return { routes, loadRoutes };
}
