import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

export type DailySalesPoint = {
  sale_date: string;
  total_sales: number;
  order_count: number;
};

export const getAllDailySalesData = cache(
  async (): Promise<DailySalesPoint[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_daily_sales_all_time");

    if (error) throw new Error(error.message);

    console.log("All Time Daily Sales: ", data);

    return (data ?? []) as DailySalesPoint[];
  },
);
