import type { ReactElement } from "react";
import type { AgentRow } from "../types/agent-types";
import { AgentCard } from "./AgentCard";
import { AgentCardSkeleton } from "./AgentCardSkeleton";

export function AgentGrid({
  agents,
  loading,
}: {
  agents: AgentRow[];
  loading: boolean;
}): ReactElement {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{agents.length}</span>{" "}
        {agents.length === 1 ? "agent" : "agents"}
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
