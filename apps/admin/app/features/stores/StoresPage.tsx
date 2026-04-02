import type { ReactElement } from "react";
import { Store } from "lucide-react";

import { getStores, getStoreSaleYears } from "./services/storesService";
import { StoresTable } from "./components/StoresTable";

export async function StoresPage({
  year,
}: {
  year?: number;
}): Promise<ReactElement> {
  const [stores, years] = await Promise.all([getStores(year), getStoreSaleYears()]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
        <div className="mx-auto w-full max-w-[1200px]">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Stores</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Store directory with sales performance.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          {stores.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <Store className="h-10 w-10 opacity-50" />
              <p className="text-sm">No stores found.</p>
              <p className="text-xs">
                Stores will appear once agents sync their route data.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {stores.length}
                </span>{" "}
                stores
              </p>
              <StoresTable stores={stores} years={years} selectedYear={year} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default StoresPage;
