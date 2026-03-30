"use client";

import { useState } from "react";
import { TopAgentsChart } from "@/app/features/dashboard/components/phase1/TopAgentsChart";
import { KpiStrip } from "@/app/features/dashboard/components/phase1/KpiStrip";
import { ProductSoldVsBoChart } from "@/app/features/dashboard/components/phase1/ProductSoldVsBoChart";
import { TopProductsSoldTable } from "@/app/features/dashboard/components/phase1/TopProductsSoldTable";
import { SalesLineChart } from "@/app/features/dashboard/components/phase1/SalesLineChart";
import { FilterRange } from "../types";
import { FILTERS } from "../types";
import { useRouter } from "next/navigation";

export function DashboardClient({ data }: { data: any }) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterRange>("7days");

  function onFilterChange(newFilters: any) {
    const date = getDateRange(newFilters);
    setFilter(newFilters);
    router.push(`?dateFrom=${date.from}&dateTo=${date.to}`);
  }

  function getDateRange(filter: FilterRange): { from: string; to: string } {
    const now = new Date();
    const to = now.toISOString();

    if (filter === "today") {
      const today = to.split("T")[0];
      return { from: today, to: today };
    }

    const days = filter === "7days" ? 7 : 30;
    const from = new Date(now);
    from.setDate(now.getDate() - days);
    return { from: from.toISOString().split("T")[0], to: to.split("T")[0] };
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
        <div className="mx-auto w-full max-w-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Monitor your field operations.
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg border bg-white p-1 dark:bg-background">
              {FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => onFilterChange(value)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                    filter === value
                      ? "bg-emerald-800 text-white"
                      : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-300 space-y-6">
          <KpiStrip data={data} filter={filter} />
          <div className="grid gap-6 xl:grid-cols-[7fr_3fr]">
            <SalesLineChart data={data} filter={filter} />
            <TopProductsSoldTable data={data} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <ProductSoldVsBoChart data={data} />
            <TopAgentsChart data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
