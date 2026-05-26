"use server";

import { createClient } from "@/utils/supabase/server";
import type { SessionInventoryRow } from "../types/session-types";

export async function getSessionInventory(
  sessionId: string,
): Promise<SessionInventoryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("session_inventory")
    .select("id, product_id, snapshot_product_name, quantity, created_at")
    .eq("route_session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    productId: row.product_id,
    productName: row.snapshot_product_name,
    quantity: row.quantity,
    createdAt: row.created_at,
  }));
}

export async function getSessionSoldByProduct(
  sessionId: string,
): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sales")
    .select("product_id, quantity_sold, session_stores!inner(route_session_id)")
    .eq("session_stores.route_session_id", sessionId);

  if (error) throw new Error(error.message);

  const sold: Record<string, number> = {};
  for (const row of data ?? []) {
    const r = row as any;
    sold[r.product_id] = (sold[r.product_id] ?? 0) + (r.quantity_sold ?? 0);
  }
  return sold;
}
