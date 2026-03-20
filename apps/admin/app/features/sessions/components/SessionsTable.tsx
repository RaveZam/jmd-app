import type { ReactElement } from "react";
import type { SessionRow } from "../types/session-types";
import { SessionStatusBadge } from "./SessionStatusBadge";

export function SessionsTable({
  sessions,
}: {
  sessions: SessionRow[];
}): ReactElement {
  return (
    <div className="overflow-auto rounded-2xl border bg-card shadow-soft">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-muted/60 text-xs text-muted-foreground backdrop-blur">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Route</th>
            <th className="px-4 py-3 text-left font-medium">Conducted By</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="border-t">
              <td className="px-4 py-3 font-medium">{session.routeName}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {session.conductedByName}
              </td>
              <td className="px-4 py-3">
                <SessionStatusBadge status={session.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
