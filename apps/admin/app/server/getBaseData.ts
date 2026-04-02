import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { getAgentMap } from "@/app/server/getAgentMap";
import type { AdminFilters } from "@/lib/selectors/filters";

export const getRecords = cache(async (filters: any) => {
  const [supabase, agentMap] = await Promise.all([
    createClient(),
    getAgentMap(),
  ]);

  const { data, error } = await supabase
    .from("route_sessions")
    .select(
      `
      id, session_date, conducted_by,
      session_stores!inner(
        sales(*),
        stores(store_name)
      )
    `,
    )
    .gte("session_date", filters.dateFrom)
    .lte("session_date", filters.dateTo)
    .order("session_date", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).flatMap((row) => {
    const agentId: string = row.conducted_by ?? "";
    const agent = agentMap[agentId]?.name ?? "Unknown";

    return (row.session_stores as any[]).flatMap((sessionStore) => {
      const storeName: string = sessionStore.stores?.store_name ?? "";

      return (sessionStore.sales as any[]).map((sale) => ({
        id: sale.id,
        sessionId: row.id as string,
        date: row.session_date,
        createdAt: sale.created_at ?? null,
        agent,
        store: storeName,
        product: sale.snapshot_product_name ?? "",
        soldQty: sale.quantity_sold ?? 0,
        boQty: sale.quantity_bo ?? 0,
        unitPrice: sale.snapshot_price ?? 0,
        total: sale.total ?? 0,
      }));
    });
  });
});
