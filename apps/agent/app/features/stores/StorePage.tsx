"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import { mockStoreLists } from "@/lib/mock/storelists";
import { SearchBar } from "./components/SearchBar";
import { StoreList } from "./components/StoreList";

function filterStores(
  stores: typeof mockStoreLists,
  query: string,
): typeof mockStoreLists {
  const q = query.trim().toLowerCase();
  if (!q) return stores;
  return stores.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q) ||
      s.addressLine.toLowerCase().includes(q),
  );
}

export function StorePage(): ReactElement {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterStores(mockStoreLists, query), [query]);

  return (
    <div className="min-h-dvh dark:bg-black">
      <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/65 px-5 py-4 backdrop-blur dark:border-zinc-800/80 dark:bg-black/60">
        <div className="mx-auto w-full max-w-[720px] space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 dark:text-zinc-50">
            Stores
          </h1>
          <p className="text-sm text-emerald-900/70 dark:text-zinc-400">
            View stores first — pick one to start your run.
          </p>
        </div>
      </header>
      <main className="px-5 py-5">
        <div className="mx-auto w-full max-w-[720px] space-y-4">
          <SearchBar value={query} onChange={setQuery} />
          <StoreList stores={filtered} />
        </div>
      </main>
    </div>
  );
}

export default StorePage;
