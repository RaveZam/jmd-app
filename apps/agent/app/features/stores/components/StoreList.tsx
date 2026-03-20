import type { ReactElement } from "react";
import Link from "next/link";

import type { StoreListItem } from "@/lib/mock/storelists";
import { StoreCard } from "./StoreCard";

export function StoreList({
  stores,
}: {
  stores: StoreListItem[];
}): ReactElement {
  if (stores.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 text-sm text-muted-foreground shadow-sm dark:bg-card">
        No stores yet.
      </div>
    );
  }

  const ordered = [...stores].sort((a, b) => {
    // Untendered (visitedToday === false) first
    if (a.visitedToday === b.visitedToday) {
      return a.name.localeCompare(b.name);
    }
    return a.visitedToday ? 1 : -1;
  });

  return (
    <ul className="space-y-3">
      {ordered.map((store) => (
        <li key={store.id}>
          <Link href={`/store?id=${store.id}`}>
            <StoreCard store={store} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default StoreList;
