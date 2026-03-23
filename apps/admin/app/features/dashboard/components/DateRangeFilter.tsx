"use client";

import { useState, type ReactElement } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const presets = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
] as const;

type PresetKey = (typeof presets)[number]["key"];

export function DateRangeFilter(): ReactElement {
  const [active, setActive] = useState<PresetKey>("today");

  return (
    <div className="flex items-center gap-3">
      {/* Segmented preset toggle */}
      <div className="relative flex items-center rounded-lg border bg-muted/50 p-0.5">
        {presets.map((preset) => (
          <button
            key={preset.key}
            onClick={() => setActive(preset.key)}
            className={cn(
              "relative z-10 rounded-md px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-200",
              active === preset.key
                ? "bg-emerald-800 text-white shadow-sm dark:bg-emerald-700"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Date display chip */}
      <button className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-emerald-300 hover:text-foreground dark:hover:border-emerald-700">
        <Calendar className="h-3.5 w-3.5" />
        <span className="tabular-nums">
          {active === "today" && "Mar 23, 2026"}
          {active === "week" && "Mar 17 – 23, 2026"}
          {active === "month" && "Mar 1 – 23, 2026"}
        </span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </button>
    </div>
  );
}
