import { enqueueOutbox } from "@/src/lib/sync/outbox";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";

type InsertRouteSessionInput = {
  sessionId: string;
  routeName: string;
  sessionDate: string;
  conductedBy: string;
  createdAt: string;
};

// Must be called inside a withTransactionSync block — has no transaction of its own.
export function insertRouteSession(input: InsertRouteSessionInput): void {
  RouteSessionsDao.insert(
    input.routeName,
    input.sessionDate,
    input.conductedBy,
    input.sessionId,
  );
  enqueueOutbox({
    entityType: "route_session",
    entityId: input.sessionId,
    operation: "create",
    payload: {
      id: input.sessionId,
      route_name: input.routeName,
      session_date: input.sessionDate,
      conducted_by: input.conductedBy,
      status: "ongoing",
      created_at: input.createdAt,
    },
  });
}
