import type { ReactElement } from "react";
import type { AgentRow } from "../types/agent-types";
import { AgentCard } from "./AgentCard";

export function AgentGrid({
  agents,
}: {
  agents: AgentRow[];
}): ReactElement {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
