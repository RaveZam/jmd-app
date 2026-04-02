"use server";

import { createClient } from "@/utils/supabase/server";
import type { StoreRow } from "../types/store-types";

export async function getStores(): Promise<StoreRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_stores_summary");

  if (error) throw new Error(error.message);

  return (data ?? []).map((s: any) => ({
    id: s.id,
    storeName: s.store_name,
    contactNumber: s.contact_number,
    contactName: s.contact_name,
    province: s.province,
    city: s.city,
    barangay: s.barangay,
    createdAt: s.created_at,
    totalSales: Number(s.total_sales),
    totalBO: Number(s.total_bo),
    totalRevenue: Number(s.total_revenue),
    visitCount: Number(s.visit_count),
    topItems: (s.top_items ?? []) as { productName: string; sold: number }[],
  }));
}
