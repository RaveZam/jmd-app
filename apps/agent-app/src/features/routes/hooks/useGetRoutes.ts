import RoutesDao from "@/lib/sqlite/dao/routes-dao";
import { useEffect, useState } from "react";
import { Route } from "../types/routes-type";

export default function useGetRoutes() {
  async function getAllRoutes() {
    const routesDao = new RoutesDao();
    return await routesDao.getAllRoutes();
  }
  return { getAllRoutes };
}
