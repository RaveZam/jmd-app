import type { ReactElement } from "react";
import type { StoreListItem } from "@/lib/mock/storelists";

function formatLastVisited(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function StoreCard({ store }: { store: StoreListItem }): ReactElement {
  const hasContact = Boolean(store.contactName || store.contactPhone);

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950">
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
        {store.lastVisitedISO ? (
          <span>Last visited {formatLastVisited(store.lastVisitedISO)}</span>
        ) : (
          <span>Not visited yet</span>
        )}

        {hasContact ? <span className="text-zinc-300 dark:text-zinc-700">•</span> : null}

        {store.contactName ? <span>{store.contactName}</span> : null}
        {store.contactPhone ? <span>{store.contactPhone}</span> : null}
      </div>
    </div>
  );
}

export default StoreCard;
