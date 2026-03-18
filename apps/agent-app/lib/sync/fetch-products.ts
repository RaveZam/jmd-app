import { supabase } from "../supabase";
import { ProductsDao } from "../sqlite/dao/products-dao";
import { checkWifi } from "../hooks/wifi-checker";

export async function fetchAndSyncProducts(): Promise<void> {
  const isConnected = await checkWifi();
  if (!isConnected) return;

  const { data, error } = await supabase.from("products").select("*");

  console.log("data", data);

  if (error || !data) {
    console.warn("Failed to fetch products:", error?.message);
    return;
  }

  console.log(`[fetch-products] Fetched ${data.length} products from Supabase`);

  for (const product of data) {
    ProductsDao.upsertProduct(
      product.id,
      product.product_name,
      product.product_price,
    );
  }

  ProductsDao.logAll();
}
