import type { ReactElement } from "react";

import type { StoreListItem } from "@/lib/mock/storelists";
import { StoreCard } from "./StoreCard";

export function StoreList({
  stores,
}: {
  stores: StoreListItem[];
}): ReactElement {
  if (stores.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
        No stores yet.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {stores.map((store) => (
        <li key={store.id}>
          <StoreCard store={store} />
        </li>
      ))}
    </ul>
  );
}

export default StoreList;
