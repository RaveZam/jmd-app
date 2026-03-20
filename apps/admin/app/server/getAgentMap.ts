"use server";

import { createClient } from "@supabase/supabase-js";

export type AgentInfo = { name: string; email: string };

export async function getAgentMap(): Promise<Record<string, AgentInfo>> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  const map: Record<string, AgentInfo> = {};
  for (const user of data.users) {
    map[user.id] = {
      name: (user.user_metadata?.name as string) || user.email || "Unknown",
      email: user.email || "",
    };
  }
  return map;
}
