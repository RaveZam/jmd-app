import { createClient } from "@/utils/supabase/server";
import { getAgentMap } from "@/app/server/getAgentMap";

export type RouteSession = {
  id: string;
  routeName: string;
  sessionDate: string;
  agentName: string;
};

export async function fetchSessions(): Promise<RouteSession[]> {
  const [supabase, agentMap] = await Promise.all([
    createClient(),
    getAgentMap(),
  ]);

  const { data, error } = await supabase
    .from("route_sessions")
    .select("id, route_name, session_date, conducted_by")
    .order("session_date", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((s) => ({
    id: s.id,
    routeName: s.route_name,
    sessionDate: s.session_date,
    agentName: agentMap[s.conducted_by]?.name ?? "Unknown",
  }));
}
