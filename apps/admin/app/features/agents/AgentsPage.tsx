import type { ReactElement } from "react";
import { getAgents } from "./services/agentsService";
import { AgentsClient } from "./components/AgentsClient";

async function AgentsPage(): Promise<ReactElement> {
  const agents = await getAgents();
  return <AgentsClient agents={agents} />;
}

export { AgentsPage };
export default AgentsPage;
