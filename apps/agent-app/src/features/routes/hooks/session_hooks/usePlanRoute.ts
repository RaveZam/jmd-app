import { useState } from "react";
import { createSessionPlan } from "./createSessionPlan";
import { createPlannedStores } from "./createPlannedStores";
import { getPhTime } from "@/helpers/getPhTime";
import { supabase } from "@/lib/supabase";
import StoresDao from "@/lib/sqlite/dao/store-dao";
import OutboxDao from "@/lib/sqlite/dao/outbox-dao";

export function usePlanRoute(routeId: string, routeName: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const createSession = async () => {
    const sessionDate = getPhTime().toISOString().split("T")[0];
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const conductedBy = session?.user?.id;
    if (!conductedBy) {
      throw new Error("User not authenticated");
    }
    const newSessionId = createSessionPlan(
      routeName,
      sessionDate.toString(),
      conductedBy,
    );
    setSessionId(newSessionId);

    OutboxDao.insertOutbox(
      "SESSION_PLAN_CREATED",
      JSON.stringify({
        id: newSessionId,
        route_name: routeName,
        session_date: sessionDate,
        conducted_by: conductedBy,
        status: "ongoing",
        created_at: getPhTime().toISOString(),
      }),
      2,
    );

    const stores = StoresDao.getStoresForRoute(routeId);
    const storeIds = stores.map((s) => s.id);
    const plannedStores = createPlannedStores(newSessionId, storeIds);

    plannedStores.forEach(({ id, storeId }) => {
      OutboxDao.insertOutbox(
        "SESSION_STORE_ADDED",
        JSON.stringify({
          id,
          route_session_id: newSessionId,
          store_id: storeId,
          visited: false,
          created_at: getPhTime().toISOString(),
        }),
        3,
      );
    });

    return newSessionId;
  };

  return {
    sessionId,
    createSession,
  };
}
export default usePlanRoute;
