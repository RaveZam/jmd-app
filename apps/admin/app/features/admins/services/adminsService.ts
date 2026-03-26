"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { AdminRow } from "../types/admin-types";

export async function getAdmins(): Promise<AdminRow[]> {
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  return data.users
    .filter((u) => u.user_metadata?.role === "admin")
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: (u.user_metadata?.name as string) || u.email || "Unknown",
      createdAt: u.created_at,
    }));
}
