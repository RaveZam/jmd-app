"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { Plus, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  RegisterAgentModal,
  type NewAgent,
} from "./RegisterAgentModal";
import { AgentGrid } from "./AgentGrid";
import { createAgent } from "../services/createAgent";
import { getAgents } from "../services/agentsService";
import type { AgentRow } from "../types/agent-types";

export function AgentsClient({
  agents: initialAgents,
}: {
  agents: AgentRow[];
}): ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const [agents, setAgents] = useState(initialAgents);

  function handleRegister(agent: NewAgent): void {
    createAgent({
      email: agent.email,
      name: agent.name,
      password: agent.password,
      confirmPassword: agent.password,
    }).then(() => {
      getAgents().then(setAgents);
    });
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Agents</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Agent profiles and field performance.
              </p>
            </div>
            <Button
              type="button"
              className="rounded-2xl"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Register agent
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px]">
          {agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
              <User className="h-10 w-10 opacity-50" />
              <p className="text-sm">No agents yet.</p>
              <p className="text-xs">Register an agent to get started.</p>
            </div>
          ) : (
            <AgentGrid agents={agents} loading={false} />
          )}
        </div>
      </div>

      {modalOpen ? (
        <RegisterAgentModal
          onClose={() => setModalOpen(false)}
          onRegister={handleRegister}
        />
      ) : null}
    </>
  );
}
