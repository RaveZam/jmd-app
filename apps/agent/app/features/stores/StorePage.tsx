"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";

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
    <div className="min-h-dvh bg-white dark:bg-background">
      <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/65 px-5 py-4 backdrop-blur dark:border-border dark:bg-background/60">
        <div className="mx-auto w-full max-w-[720px] space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 dark:text-zinc-50">
            Store Distribution Logs
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
      <Link
        href="/add-store"
        aria-label="Add store"
        className="fixed right-6 bottom-6 z-30 focus:outline-none"
      >
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 text-white flex items-center justify-center shadow-lg dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-700">
          <span className="text-2xl leading-none">+</span>
        </div>
      </Link>
    </div>
  );
}

export default StorePage;
