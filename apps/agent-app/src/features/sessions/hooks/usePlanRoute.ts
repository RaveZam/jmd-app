import { useState } from "react";
import { createSessionWithStores } from "../services/sessionLocalService";

export function usePlanRoute(routeId: string, routeName: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const createSession = async () => {
    const newSessionId = await createSessionWithStores(routeId, routeName);
    setSessionId(newSessionId);
    return newSessionId;
  };

  return {
    sessionId,
    createSession,
  };
}
export default usePlanRoute;
