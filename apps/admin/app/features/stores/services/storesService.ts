"use server";

import { createClient } from "@/utils/supabase/server";
import type { StoreRow } from "../types/store-types";

export async function getStores(): Promise<StoreRow[]> {
  const supabase = await createClient();

  const [storeResult, ssResult, salesResult] = await Promise.all([
    supabase
      .from("stores")
      .select(
        "id, store_name, contact_number, contact_name, province, city, barangay, created_at",
      )
      .order("store_name"),
    supabase.from("session_stores").select("id, store_id, visited"),
    supabase
      .from("sales")
      .select("session_store_id, quantity_sold, quantity_bo, total, products(product_name)"),
  ]);

  if (storeResult.error) throw new Error(storeResult.error.message);
  if (ssResult.error) throw new Error(ssResult.error.message);
  if (salesResult.error) throw new Error(salesResult.error.message);

  // session_store_id → store_id map + visit counts
  const ssToStore = new Map<string, string>();
  const visitsByStore = new Map<string, number>();
  for (const ss of ssResult.data ?? []) {
    ssToStore.set(ss.id, ss.store_id);
    if (ss.visited) {
      visitsByStore.set(
        ss.store_id,
        (visitsByStore.get(ss.store_id) ?? 0) + 1,
      );
    }
  }

  // Aggregate sales by store
  const salesByStore = new Map<
    string,
    { sold: number; bo: number; revenue: number; products: Map<string, number> }
  >();
  for (const sale of salesResult.data ?? []) {
    const storeId = ssToStore.get(sale.session_store_id);
    if (!storeId) continue;
    const productName =
      (sale.products as { product_name: string } | null)?.product_name ?? "Unknown";
    const qty = sale.quantity_sold ?? 0;
    const existing = salesByStore.get(storeId);
    if (existing) {
      existing.sold += qty;
      existing.bo += sale.quantity_bo ?? 0;
      existing.revenue += Number(sale.total ?? 0);
      existing.products.set(productName, (existing.products.get(productName) ?? 0) + qty);
    } else {
      salesByStore.set(storeId, {
        sold: qty,
        bo: sale.quantity_bo ?? 0,
        revenue: Number(sale.total ?? 0),
        products: new Map([[productName, qty]]),
      });
    }
  }

  return (storeResult.data ?? []).map((s) => {
    const sales = salesByStore.get(s.id) ?? {
      sold: 0,
      bo: 0,
      revenue: 0,
      products: new Map<string, number>(),
    };
    const topItems = Array.from(sales.products.entries())
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
      totalSales: sales.sold,
      totalBO: sales.bo,
      totalRevenue: sales.revenue,
      visitCount: visitsByStore.get(s.id) ?? 0,
      topItems,
    };
  });
}
