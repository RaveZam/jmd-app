"use client";

import type { ReactElement } from "react";
import type { StoreListItem } from "@/lib/mock/storelists";
import Link from "next/link";

type Props = { store: StoreListItem };

export default function StoreHeader({ store }: Props): ReactElement {
  return (
    <header className="sticky top-0 z-20 bg-emerald-900 dark:bg-emerald-950">
      <div className="mx-auto w-full max-w-[720px] px-5 pb-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Link
              href="/"
              aria-label="Back"
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold leading-tight text-white">{store.name}</h1>
              <p className="mt-0.5 text-sm text-emerald-300">
                {store.area} · {store.addressLine}
              </p>
            </div>
          </div>
          <span className="mt-1 shrink-0 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            In progress
          </span>
        </div>
      </div>
    </header>
  );
}
