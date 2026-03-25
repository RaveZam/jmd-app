"use server";

import { createClient } from "@/utils/supabase/server";
import type { StoreRow } from "../types/store-types";

export async function getStores(): Promise<StoreRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stores")
    .select(
      `id, store_name, contact_number, contact_name, province, city, barangay, created_at,
       session_stores ( visited, sales ( quantity_sold, quantity_bo, total, products ( product_name ) ) )`,
    )
    .order("store_name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((s) => {
    const productTotals = new Map<string, number>();
    let sold = 0,
      bo = 0,
      revenue = 0,
      visitCount = 0;

    for (const ss of s.session_stores ?? []) {
      if (ss.visited) visitCount++;
      for (const sale of ss.sales ?? []) {
        const qty = sale.quantity_sold ?? 0;
        sold += qty;
        bo += sale.quantity_bo ?? 0;
        revenue += Number(sale.total ?? 0);
        const name =
          (sale.products as unknown as { product_name: string } | null)
            ?.product_name ?? "Unknown";

        productTotals.set(name, (productTotals.get(name) ?? 0) + qty);
      }
    }

    const topItems = Array.from(productTotals.entries())
      .map(([productName, sold]) => ({ productName, sold }))
      .sort((a, b) => b.sold - a.sold);

    return {
      id: s.id,
      storeName: s.store_name,
      contactNumber: s.contact_number,
      contactName: s.contact_name,
      province: s.province,
      city: s.city,
      barangay: s.barangay,
      createdAt: s.created_at,
      totalSales: sold,
      totalBO: bo,
      totalRevenue: revenue,
      visitCount,
      topItems,
    };
  });
}
