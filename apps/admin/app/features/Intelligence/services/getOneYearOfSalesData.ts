import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

export type DailySalesPoint = {
  sale_date: string;
  total_sales: number;
  order_count: number;
};

export const getOneYearOfSalesData = cache(async (): Promise<DailySalesPoint[]> => {
  const supabase = await createClient();

  const year = new Date().getFullYear();
  const { data, error } = await supabase.rpc("get_daily_sales", { p_year: year });

  if (error) throw new Error(error.message);

  console.log("get_daily_sales result:", data);

  return (data ?? []) as DailySalesPoint[];
});
