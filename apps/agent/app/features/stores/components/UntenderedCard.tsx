import type { ReactElement } from "react";
import type { StoreListItem } from "@/lib/mock/storelists";

export function UntenderedCard({
  store,
}: {
  store: StoreListItem;
}): ReactElement {
  const hasContact = Boolean(store.contactName || store.contactPhone);
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-emerald-950 dark:text-zinc-50">
            {store.name}
          </p>
          <p className="mt-1 truncate text-sm text-emerald-900/70 dark:text-zinc-400">
            {store.addressLine}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          {store.area}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-emerald-900/70 dark:text-zinc-400">
        <span>Not yet today</span>
        {hasContact ? (
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
        ) : null}
        {store.contactName ? <span>{store.contactName}</span> : null}
        {store.contactPhone ? <span>{store.contactPhone}</span> : null}
      </div>
    </>
  );
}
