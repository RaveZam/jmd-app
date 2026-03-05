"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { Plus, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RegisterAgentModal,
  type NewAgent,
} from "./components/RegisterAgentModal";
import { createAgent } from "./services/createAgent";

function AgentsPage(): ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const [agents] = useState<{ id: string; username: string }[]>([]);

  function handleRegister(agent: NewAgent): void {
    createAgent({
      email: agent.email,
      name: agent.name,
      password: agent.password,
      confirmPassword: agent.password,
    });
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Agents</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Active agents (empty for now).
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
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <Card className="rounded-2xl border shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Active agents</CardTitle>
            </CardHeader>
            <CardContent>
              {agents.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
                  <User className="h-10 w-10 opacity-50" />
                  <p className="text-sm">No agents yet.</p>
                  <p className="text-xs">Register an agent to get started.</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {agents.map((a) => (
                    <li key={a.id} className="py-2 text-sm">
                      {a.username}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
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

export { AgentsPage };
export default AgentsPage;
