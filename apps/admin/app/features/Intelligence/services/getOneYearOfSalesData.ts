import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

export const getOneYearOfSalesData = cache(async () => {
  const supabase = await createClient();
  console.log("Calling One Year Worth Of Data");

  const now = new Date();
  const dateTo = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const dateFrom = new Date(dateTo);
  dateFrom.setFullYear(dateFrom.getFullYear() - 1);

  const { data, error } = await supabase
    .from("sales")
    .select(
      `
     *,
      session_stores!inner(
        stores(store_name),
        route_sessions!inner(session_date, conducted_by)
      )
    `,
    )
    .order("created_at", { ascending: false })
    .gte(
      "session_stores.route_sessions.session_date",
      dateFrom.toISOString().split("T")[0],
    )
    .lte(
      "session_stores.route_sessions.session_date",
      dateTo.toISOString().split("T")[0],
    );

  console.log("Yearly Data", data);
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const store = (row.session_stores as any)?.stores;
    return {
      id: row.id,
      store: store.store_name,
      product: row.snapshot_product_name ?? "",
      soldQty: row.quantity_sold ?? 0,
      boQty: row.quantity_bo ?? 0,
      unitPrice: row.snapshot_price ?? 0,
      total: row.total ?? 0,
      createdAt: row.created_at ?? null,
    };
  });
});
