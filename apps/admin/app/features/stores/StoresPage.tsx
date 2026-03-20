"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Store } from "lucide-react";

import type { StoreRow } from "./types/store-types";
import { getStores } from "./services/storesService";
import { StoresTable } from "./components/StoresTable";

export function StoresPage(): ReactElement {
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores()
      .then(setStores)
      .finally(() => setLoading(false));
  }, []);

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
          {loading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading stores...
            </p>
          ) : stores.length === 0 ? (
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
              <StoresTable stores={stores} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default StoresPage;
