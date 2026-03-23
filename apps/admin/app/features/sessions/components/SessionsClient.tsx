"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

import type { SessionRow, SessionStoreRow } from "../types/session-types";
import { getSessionStores } from "../services/sessionsService";
import { SessionCard } from "./SessionCard";
import { SessionStoreList } from "./SessionStoreList";

export function SessionsClient({
  sessions,
}: {
  sessions: SessionRow[];
}): ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stores, setStores] = useState<SessionStoreRow[]>([]);
  const [storesLoading, setStoresLoading] = useState(false);

  async function handleSelect(id: string) {
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
    setStoresLoading(true);
    try {
      const result = await getSessionStores(id);
      setStores(result);
    } finally {
      setStoresLoading(false);
    }
  }

  const selected = sessions.find((s) => s.id === selectedId);

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
        <div className="mx-auto w-full max-w-[1200px]">
          <h1 className="text-3xl font-semibold tracking-tight">Sessions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Field activity monitor. Track agent route sessions.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px]">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <CalendarDays className="h-10 w-10 opacity-50" />
              <p className="text-sm">No sessions recorded yet.</p>
              <p className="text-xs">
                Sessions will appear here once agents start their routes.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <div className="space-y-3">
                <p className="text-xs font-medium tracking-wider text-muted-foreground">
                  ALL SESSIONS ({sessions.length})
                </p>
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isSelected={session.id === selectedId}
                    onClick={() => handleSelect(session.id)}
                  />
                ))}
              </div>

              <div className="xl:sticky xl:top-6 xl:self-start">
                {selectedId && selected ? (
                  <SessionStoreList
                    session={selected}
                    stores={stores}
                    loading={storesLoading}
                  />
                ) : (
                  <div className="hidden items-center justify-center rounded-2xl border border-dashed py-20 text-sm text-muted-foreground xl:flex">
                    Select a session to view store details
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
