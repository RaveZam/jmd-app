import { useState } from "react";
import { createSessionPlan } from "./createSessionPlan";
import { createPlannedStores } from "./createPlannedStores";
import { getPhTime } from "@/helpers/getPhTime";
import { supabase } from "@/lib/supabase";
import StoresDao from "@/lib/sqlite/dao/store-dao";

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

    const stores = StoresDao.getStoresForRoute(routeId);
    const storeIds = stores.map((s) => s.id);
    createPlannedStores(newSessionId, storeIds);

    return newSessionId;
  };

  return {
    sessionId,
    createSession,
  };
}
export default usePlanRoute;
