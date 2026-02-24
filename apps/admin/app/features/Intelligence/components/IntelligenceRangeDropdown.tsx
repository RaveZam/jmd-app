"use client";

import { useRouter, usePathname } from "next/navigation";
import type { ReactElement } from "react";

type Range = 7 | 30;

export function IntelligenceRangeDropdown({
  currentRange,
  currentDate,
}: {
  currentRange: Range;
  currentDate: string;
}): ReactElement {
  const router = useRouter();
  const pathname = usePathname();

  function setRange(range: Range) {
    const params = new URLSearchParams();
    params.set("date", currentDate);
    params.set("range", String(range));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 rounded-lg border bg-background p-1">
      <button
        type="button"
        onClick={() => setRange(7)}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          currentRange === 7 ? "bg-emerald-100 text-emerald-900" : "text-muted-foreground hover:bg-muted"
        }`}
      >
        Last 7 days
      </button>
      <button
        type="button"
        onClick={() => setRange(30)}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          currentRange === 30 ? "bg-emerald-100 text-emerald-900" : "text-muted-foreground hover:bg-muted"
        }`}
      >
        Last 30 days
      </button>
    </div>
  );
}
