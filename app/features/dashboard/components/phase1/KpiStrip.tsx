import type { ReactElement } from "react";

import { KpiCard } from "./KpiCard";

export type KpiStripItem = {
  title: string;
  primary: string;
  secondary?: string;
  tone?: "neutral" | "primary";
};

export function KpiStrip({ items }: { items: KpiStripItem[] }): ReactElement {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <KpiCard
          key={item.title}
          title={item.title}
          primary={item.primary}
          secondary={item.secondary}
          tone={item.tone}
        />
      ))}
    </div>
  );
}

