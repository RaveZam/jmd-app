import { useEffect, useRef } from "react";
import { router, useSegments } from "expo-router";
import { supabase } from "@/lib/supabase";
import { initDb } from "@/lib/sqlite/db-migration";
import { fetchAndSyncProducts } from "@/lib/sync/fetch-products";
import RouteSessionsDao from "@/lib/sqlite/dao/route-sessions-dao";
import SessionStoresDao from "@/lib/sqlite/dao/session-stores-dao";

export function useAuthGuard(setCheckingSession: (value: boolean) => void) {
  const segments = useSegments();
  const productsFetched = useRef(false);

  useEffect(() => {
    initDb();
    RouteSessionsDao.logAll();
    SessionStoresDao.logAll();
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;
        if (!mounted) return;
        if (session && !productsFetched.current) {
          productsFetched.current = true;
          await fetchAndSyncProducts();
        }
        const onAuthRoute = segments[0] === "auth";
        if (!session && !onAuthRoute) {
          router.replace("/auth/sign-in");
        } else if (session && onAuthRoute) {
          router.replace("/");
        }
      } catch {
      } finally {
        if (mounted) setCheckingSession(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments]);
}
