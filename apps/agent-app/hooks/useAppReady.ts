import { useEffect } from "react";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { syncOutbox } from "@/lib/sync/sync-outbox";
import RouteSessionsDao from "@/lib/sqlite/dao/route-sessions-dao";

export function useAppReady(checkingSession: boolean) {
  useEffect(() => {
    if (checkingSession) return;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const ongoing = RouteSessionsDao.getOngoing();
        if (ongoing) {
          router.replace({
            pathname: "/main/routes/session",
            params: { sessionId: ongoing.id, routeName: ongoing.route_name },
          });
        }
      }
    })();

    syncOutbox();
    const interval = setInterval(syncOutbox, 10_000);
    return () => clearInterval(interval);
  }, [checkingSession]);
}
