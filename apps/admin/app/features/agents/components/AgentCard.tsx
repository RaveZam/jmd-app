import type { ReactElement } from "react";
import { MapPin, Route } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AgentRow } from "../types/agent-types";

function visitRate(visited: number, planned: number): string {
  if (planned === 0) return "0%";
  return `${Math.round((visited / planned) * 100)}%`;
}

export function AgentCard({
  agent,
}: {
  agent: AgentRow;
}): ReactElement {
  const rate = visitRate(agent.totalStoresVisited, agent.totalStoresPlanned);

  return (
    <Card className="shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">{agent.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {agent.email}
            </p>
          </div>
          <Badge
            variant={
              agent.completedSessions > 0 ? "success" : "pending"
            }
          >
            {agent.completedSessions}/{agent.totalSessions}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Sessions</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums">
              {agent.totalSessions}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Stores</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums">
              {agent.totalStoresVisited}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Visit Rate</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums">
              {rate}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Route className="h-3 w-3" />
            {agent.completedSessions} completed
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {agent.totalStoresPlanned} planned
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
