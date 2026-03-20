"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SessionRow, SessionStoreRow } from "../types/session-types";

async function resolveAgentNames(
  uuids: string[],
): Promise<Record<string, string>> {
  if (uuids.length === 0) return {};
  try {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) return {};
    const map: Record<string, string> = {};
    for (const user of data.users) {
      map[user.id] =
        (user.user_metadata?.name as string) || user.email || user.id;
    }
    return map;
  } catch {
    return {};
  }
}

export async function getSessions(): Promise<SessionRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("route_sessions")
    .select("id, route_name, session_date, conducted_by, status, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const sessions = data ?? [];
  const uuids = [...new Set(sessions.map((s) => s.conducted_by))];
  const agentNames = await resolveAgentNames(uuids);

  return sessions.map((s) => ({
    id: s.id,
    routeName: s.route_name,
    sessionDate: s.session_date,
    conductedBy: s.conducted_by,
    conductedByName: agentNames[s.conducted_by] ?? s.conducted_by,
    status: s.status as "ongoing" | "completed",
    createdAt: s.created_at,
    totalStores: 0,
    visitedStores: 0,
  }));
}

export async function getSessionStores(
  sessionId: string,
): Promise<SessionStoreRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("session_stores")
    .select(
      "id, store_id, visited, stores(store_name, province, city, barangay)",
    )
    .eq("route_session_id", sessionId);

  if (error) throw new Error(error.message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((ss: any) => ({
    id: ss.id,
    storeId: ss.store_id,
    storeName: ss.stores?.store_name ?? "Unknown",
    province: ss.stores?.province ?? null,
    city: ss.stores?.city ?? null,
    barangay: ss.stores?.barangay ?? null,
    visited: Boolean(ss.visited),
  }));
}
