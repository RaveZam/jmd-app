import RoutesDao from "@/lib/sqlite/dao/routes-dao";
import { Route } from "../types/routes-type";

const routesDao = new RoutesDao();

export const routesServices = {
  getRoutes(): Route[] {
    return routesDao.getAllRoutes() ?? [];
  },
};
