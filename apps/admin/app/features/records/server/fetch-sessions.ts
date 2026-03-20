import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";

export type RouteSession = {
  id: string;
  routeName: string;
  sessionDate: string; // YYYY-MM-DD
  agentName: string;
};

type SessionRow = {
  id: string;
  route_name: string;
  session_date: string;
  conducted_by: string;
};

export async function fetchSessions(): Promise<RouteSession[]> {
  const supabase = await createClient();
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const [sessionsResult, usersResult] = await Promise.all([
    supabase
      .from("route_sessions")
      .select("id, route_name, session_date, conducted_by")
      .order("session_date", { ascending: false }),
    supabaseAdmin.auth.admin.listUsers(),
  ]);

  if (sessionsResult.error) throw new Error(sessionsResult.error.message);

  const userMap = new Map(
    (usersResult.data?.users ?? []).map((u) => [
      u.id,
      (u.user_metadata?.name as string) ?? u.email ?? u.id,
    ]),
  );

  return (sessionsResult.data as SessionRow[]).map((s) => ({
    id: s.id,
    routeName: s.route_name,
    sessionDate: s.session_date,
    agentName: userMap.get(s.conducted_by) ?? "Unknown",
  }));
}
