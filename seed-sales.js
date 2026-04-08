// seed-sales.js — inserts 2 years of sales data (300 sales/day, 8am–6pm PH time)
// Run: node seed-sales.js

const { randomUUID } = require("crypto");

const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qb2lhdW9kbm1venVmcXRsa3J2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1ODk4NSwiZXhwIjoyMDg3MTM0OTg1fQ.sKE47-LP54cw0ypc0NO5xbN9einGuBWC-PCfYH_2B2Q";
const BASE_URL = "https://ojoiauodnmozufqtlkrv.supabase.co/rest/v1";

const authHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

const BATCH_SIZE = 500;
const SALES_PER_DAY = 300;

async function fetchAll(table, select) {
  const res = await fetch(`${BASE_URL}/${table}?select=${select}&limit=1000`, {
    headers: authHeaders,
  });
  if (!res.ok) throw new Error(`Fetch ${table} failed: ${await res.text()}`);
  return res.json();
}

async function batchInsert(table, rows) {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${BASE_URL}/${table}`, {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(chunk),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Insert ${table}[${i}..${i + chunk.length}] failed: ${text}`);
    }
    process.stdout.write(`  [${table}] ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}\r`);
  }
  console.log(`  [${table}] ${rows.length}/${rows.length} — done`);
}

// Random integer inclusive [min, max]
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random timestamptz between 8am–6pm PH time (UTC+8 → UTC 00:00–10:00) for a given PH date string
function randomSaleTimestamp(phDateStr) {
  // phDateStr is YYYY-MM-DD in PH local date
  // 8am PHT = 00:00 UTC on that date; 6pm PHT = 10:00 UTC
  const baseUTC = new Date(phDateStr + "T00:00:00.000Z"); // midnight UTC = 8am PHT
  const randomMinutes = rand(0, 10 * 60 - 1); // 0..599 minutes → 8:00am–5:59pm PHT
  baseUTC.setMinutes(baseUTC.getMinutes() + randomMinutes);
  return baseUTC.toISOString();
}

async function main() {
  console.log("Fetching products and stores...");
  const products = await fetchAll("products", "id,product_name,product_price");
  const stores = await fetchAll("stores", "id");

  console.log(`  ${products.length} products, ${stores.length} stores`);

  // Build date list: today back to 2 years ago (PH dates)
  const dates = [];
  const todayPH = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const twoYearsAgoPH = new Date(todayPH);
  twoYearsAgoPH.setFullYear(todayPH.getFullYear() - 2);

  const cursor = new Date(twoYearsAgoPH);
  while (cursor <= todayPH) {
    dates.push(cursor.toISOString().split("T")[0]); // YYYY-MM-DD
    cursor.setDate(cursor.getDate() + 1);
  }

  console.log(`\nDate range: ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} days)`);
  console.log(`Expected: ${dates.length * SALES_PER_DAY} total sales\n`);

  // ── 1. route_sessions (one per day) ─────────────────────────────────────────
  console.log("Step 1/3: Inserting route_sessions...");
  const AGENT_USER_ID = "khenn@gmail.com" === "khenn@gmail.com"
    ? "5e1f53f4-665f-4444-a7fd-dc104b82ece0"  // khenn@gmail.com
    : null;

  const routeSessions = dates.map((date) => ({
    id: `seed-rs-${date}`,
    route_name: "Seed Route",
    session_date: date,
    status: "completed",
    conducted_by: AGENT_USER_ID,
  }));
  await batchInsert("route_sessions", routeSessions);

  // ── 2. session_stores (all stores for every day) ─────────────────────────────
  console.log("\nStep 2/3: Inserting session_stores...");
  const sessionStores = [];
  for (const date of dates) {
    for (const store of stores) {
      sessionStores.push({
        id: `seed-ss-${date}-${store.id}`,
        route_session_id: `seed-rs-${date}`,
        store_id: store.id,
        visited: true,
      });
    }
  }
  await batchInsert("session_stores", sessionStores);

  // ── 3. sales (300 per day, distributed round-robin across stores) ─────────────
  console.log("\nStep 3/3: Inserting sales...");
  const allSales = [];
  for (const date of dates) {
    for (let s = 0; s < SALES_PER_DAY; s++) {
      const store = stores[s % stores.length];
      const product = products[rand(0, products.length - 1)];
      const qty = rand(1, 10);

      allSales.push({
        id: randomUUID(),
        session_store_id: `seed-ss-${date}-${store.id}`,
        product_id: product.id,
        snapshot_price: product.product_price,
        snapshot_product_name: product.product_name,
        quantity_sold: qty,
        quantity_bo: 0,
        created_at: randomSaleTimestamp(date),
      });
    }
  }
  await batchInsert("sales", allSales);

  console.log(`\nSeeding complete! ${allSales.length} sales inserted.`);
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
