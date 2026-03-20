import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";
import type { LedgerRecord } from "@/lib/mock/records";

type SaleRow = {
  id: string;
  snapshot_price: number;
  quantity_sold: number;
  quantity_bo: number;
  session_stores: {
    stores: { store_name: string };
    route_sessions: {
      id: string;
      session_date: string;
      conducted_by: string;
    };
  };
  products: { product_name: string };
};

export async function fetchRecords(): Promise<{
  records: LedgerRecord[];
  saleSessionMap: Map<string, string>; // saleId → routeSessionId
}> {
  const supabase = await createClient();
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const [salesResult, usersResult] = await Promise.all([
    supabase.from("sales").select(`
      id,
      snapshot_price,
      quantity_sold,
      quantity_bo,
      session_stores!inner (
        stores!inner ( store_name ),
        route_sessions!inner (
          id,
          session_date,
          conducted_by
        )
      ),
      products!inner ( product_name )
    `),
    supabaseAdmin.auth.admin.listUsers(),
  ]);

  if (salesResult.error) throw new Error(salesResult.error.message);

  const userMap = new Map(
    (usersResult.data?.users ?? []).map((u) => [
      u.id,
      (u.user_metadata?.name as string) ?? u.email ?? u.id,
    ]),
  );

  const records: LedgerRecord[] = [];
  const saleSessionMap = new Map<string, string>();

  for (const sale of salesResult.data as SaleRow[]) {
    const session = sale.session_stores.route_sessions;
    records.push({
      id: sale.id,
      date: session.session_date,
      agent: userMap.get(session.conducted_by) ?? "Unknown",
      store: sale.session_stores.stores.store_name,
      product: sale.products.product_name,
      deliveredQty: sale.quantity_sold,
      soldQty: sale.quantity_sold,
      boQty: sale.quantity_bo,
      unitPrice: sale.snapshot_price,
    });
    saleSessionMap.set(sale.id, session.id);
  }

  return { records, saleSessionMap };
}
