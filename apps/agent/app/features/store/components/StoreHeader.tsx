"use client";

import type { ReactElement } from "react";
import type { StoreListItem } from "@/lib/mock/storelists";
import Link from "next/link";

type Props = { store: StoreListItem };

export default function StoreHeader({ store }: Props): ReactElement {
  return (
    <header className="sticky top-0 z-20">
      <div className="mx-auto w-full max-w-[720px]">
        <div className="bg-[linear-gradient(to_bottom_right,#064e3b_0%,#065f46_50%,#047857_100%)] p-4 text-white shadow-soft">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Back" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Distribution Log</h1>
              <p className="mt-1 text-sm text-emerald-50/90">Log items distributed to this store.</p>
            </div>
          </div>
        </div>

        <div className="border-b border-emerald-100/60 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-base font-semibold tracking-tight text-emerald-950 dark:text-zinc-50">{store.name}</p>
          <p className="mt-0.5 text-sm text-emerald-900/70 dark:text-zinc-400">
            {store.area} &middot; {store.addressLine}
          </p>
          {(store.contactName || store.contactPhone) && (
            <p className="mt-0.5 text-xs text-emerald-900/50 dark:text-zinc-500">
              {[store.contactName, store.contactPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

