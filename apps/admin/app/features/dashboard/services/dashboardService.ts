"use server";

import { createClient } from "@/utils/supabase/server";
import { getAgentMap } from "@/app/server/getAgentMap";

export type TodayGlance = {
  totalSessions: number;
  completedSessions: number;
  ongoingSessions: number;
  totalStoresPlanned: number;
  storesVisited: number;
  activeAgents: string[];
};

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function getTodayGlance(): Promise<TodayGlance> {
  const [supabase, agentMap] = await Promise.all([
    createClient(),
    getAgentMap(),
  ]);

  const today = todayISO();

  const { data: sessions, error: sessErr } = await supabase
    .from("route_sessions")
    .select("id, conducted_by, status")
    .eq("session_date", today);

  if (sessErr) throw new Error(sessErr.message);

  const sessionIds = (sessions ?? []).map((s) => s.id);
  const completed = (sessions ?? []).filter(
    (s) => s.status === "completed",
  ).length;
  const ongoing = (sessions ?? []).filter(
    (s) => s.status === "ongoing",
  ).length;

  // Unique active agents today
  const agentIds = [
    ...new Set((sessions ?? []).map((s) => s.conducted_by)),
  ];
  const activeAgents = agentIds.map(
    (id) => agentMap[id]?.name ?? "Unknown",
  );

  let storesPlanned = 0;
  let storesVisited = 0;

  if (sessionIds.length > 0) {
    const { data: ssData, error: ssErr } = await supabase
      .from("session_stores")
      .select("visited")
      .in("route_session_id", sessionIds);

    if (ssErr) throw new Error(ssErr.message);

    storesPlanned = (ssData ?? []).length;
    storesVisited = (ssData ?? []).filter((ss) => ss.visited).length;
  }

  return {
    totalSessions: (sessions ?? []).length,
    completedSessions: completed,
    ongoingSessions: ongoing,
    totalStoresPlanned: storesPlanned,
    storesVisited,
    activeAgents,
  };
}
