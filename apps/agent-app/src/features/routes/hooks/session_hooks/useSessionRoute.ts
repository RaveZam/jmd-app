import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import RouteSessionsDao from "@/lib/sqlite/dao/route-sessions-dao";
import SessionStoresDao from "@/lib/sqlite/dao/session-stores-dao";

export type RouteSession = {
  id: string;
  route_name: string;
  session_date: string;
  conducted_by: string;
  status: string;
  created_at: string;
};

export type SessionStore = {
  id: string;
  route_session_id: string;
  store_id: string;
  store_name: string;
  store_province: string | null;
  store_city: string | null;
  store_barangay: string | null;
  store_contact_name: string | null;
  province_name: string | null;
  visited: number;
  created_at: string;
};

export default function useSessionRoute(sessionId: string) {
  const [session, setSession] = useState<RouteSession | null>(null);
  const [sessionStores, setSessionStores] = useState<SessionStore[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!sessionId) return;
      const s = RouteSessionsDao.getById(sessionId);
      const stores = SessionStoresDao.getBySessionId(sessionId);
      setSession(s ?? null);
      setSessionStores(stores);
    }, [sessionId]),
  );

  const visitedCount = sessionStores.filter((s) => s.visited === 1).length;
  const totalCount = sessionStores.length;

  return { session, sessionStores, visitedCount, totalCount };
}
