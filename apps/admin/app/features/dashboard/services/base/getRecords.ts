import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { getAgentMap } from "@/app/server/getAgentMap";
import type { AdminFilters } from "@/lib/selectors/filters";
import type { LedgerRecord } from "@/lib/mock/records";

export const getRecords = cache(
  async (filters: AdminFilters): Promise<LedgerRecord[]> => {
    const [supabase, agentMap] = await Promise.all([
      createClient(),
      getAgentMap(),
    ]);

    const { data, error } = await supabase
      .from("sales")
      .select(
        `
      id,
      quantity_sold,
      quantity_bo,
      snapshot_price,
      snapshot_product_name,
      session_stores!inner(
        stores(store_name),
        route_sessions!inner(session_date, conducted_by)
      )
    `,
      )
      .eq("session_stores.route_sessions.session_date", filters.date);

    console.log("getRecords raw response:", JSON.stringify(data, null, 2));

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => {
      const session = (row.session_stores as any)?.route_sessions;
      const store = (row.session_stores as any)?.stores;
      const agentId: string = session?.conducted_by ?? "";

      return {
        id: row.id,
        date: session?.session_date ?? filters.date,
        agent: agentMap[agentId]?.name ?? "Unknown",
        store: store?.store_name ?? "",
        product: row.snapshot_product_name ?? "",
        soldQty: row.quantity_sold ?? 0,
        boQty: row.quantity_bo ?? 0,
        unitPrice: row.snapshot_price ?? 0,
      };
    });
  },
);
