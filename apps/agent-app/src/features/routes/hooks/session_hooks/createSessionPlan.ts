import RouteSessionsDao from "@/lib/sqlite/dao/route-sessions-dao";

export function createSessionPlan(
  routeName: string,
  sessionDate: string,
  conductedBy: string,
) {
  const sessionId = RouteSessionsDao.insert(
    routeName,
    sessionDate,
    conductedBy,
  );
  return sessionId;
}
