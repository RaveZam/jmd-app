import type { ReactElement } from "react";
import type { StoreListItem } from "@/lib/mock/storelists";

export function TenderedCard({
  store,
}: {
  store: StoreListItem;
}): ReactElement {
  const hasContact = Boolean(store.contactName || store.contactPhone);
  return (
    <>
      <p className="text-sm font-medium text-white">Tendered</p>
      <p className="mt-2 truncate text-xl font-semibold leading-none tracking-tight text-white">
        {store.name}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white">
        <span className="shrink-0 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white">
          {store.area}
        </span>
        <span className="truncate text-white">{store.addressLine}</span>
      </div>
      {hasContact ? (
        <p className="mt-2 text-xs text-white">
          {[store.contactName, store.contactPhone].filter(Boolean).join(" · ")}
        </p>
      ) : null}
    </>
  );
}
