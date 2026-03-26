"use client";

import { TopAgentsChart } from "@/app/features/dashboard/components/phase1/TopAgentsChart";
import { KpiStrip } from "@/app/features/dashboard/components/phase1/KpiStrip";
import { ProductSoldVsBoChart } from "@/app/features/dashboard/components/phase1/ProductSoldVsBoChart";
import { TopProductsSoldTable } from "@/app/features/dashboard/components/phase1/TopProductsSoldTable";
import { SalesLineChart } from "@/app/features/dashboard/components/phase1/SalesLineChart";

export function DashboardClient() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
        <div className="mx-auto w-full max-w-[1200px]">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your field operations.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          <KpiStrip />
          <div className="grid gap-6 xl:grid-cols-[7fr_3fr]">
            <SalesLineChart />
            <TopProductsSoldTable />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <ProductSoldVsBoChart />
            <TopAgentsChart />
          </div>
        </div>
      </div>
    </>
  );
}
