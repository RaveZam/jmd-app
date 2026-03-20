import type { ReactElement } from "react";
import type { StoreListItem } from "@/lib/mock/storelists";
import { TenderedCard } from "./TenderedCard";
import { UntenderedCard } from "./UntenderedCard";

const VISITED_TODAY_GRADIENT =
  "linear-gradient(to bottom right, #064e3b 0%, #065f46 50%, #047857 100%)";

export function StoreCard({ store }: { store: StoreListItem }): ReactElement {
  const visitedToday = store.visitedToday;
  return (
    <div
      className={
        visitedToday
          ? "rounded-2xl overflow-hidden border-transparent p-4 text-white shadow-soft opacity-70"
          : "rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-border dark:bg-card dark:hover:bg-accent"
      }
      style={visitedToday ? { background: VISITED_TODAY_GRADIENT } : undefined}
    >
      {visitedToday ? (
        <TenderedCard store={store} />
      ) : (
        <UntenderedCard store={store} />
      )}
    </div>
  );
}

export default StoreCard;
