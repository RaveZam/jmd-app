import type { ReactElement } from "react";
import { HighBOAgentsList } from "@/app/features/dashboard/components/phase1/HighBOAgentsList";
import { KpiStrip } from "@/app/features/dashboard/components/phase1/KpiStrip";
import { TopProductsBOTable } from "@/app/features/dashboard/components/phase1/TopProductsBOTable";
import { TopProductsSoldTable } from "@/app/features/dashboard/components/phase1/TopProductsSoldTable";
import { mockRecords } from "@/lib/mock/records";
import { parseAdminFilters } from "@/lib/selectors/filters";
import {
  selectDashboardKpis,
  selectHighBOAgents,
  selectTopProductsBO,
  selectTopProductsSold,
} from "@/lib/selectors/metrics";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { ProjectAnalyticsChart } from "./components/ProjectAnalyticsChart";
import { TodayAtGlance } from "./components/TodayAtGlance";

function formatCurrencyPHP(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  return `${sign}₱${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatPercent(p: number): string {
  return `${(p * 100).toFixed(1)}%`;
}

export async function DashboardPage({
  searchParams,
}: {
  searchParams:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}): Promise<ReactElement> {
  const sp = await searchParams;
  const filters = parseAdminFilters(sp);

  const kpis = selectDashboardKpis(mockRecords, filters);
  const highBOAgents = selectHighBOAgents(mockRecords, filters);
  const topSold = selectTopProductsSold(mockRecords, filters, 5);
  const topBO = selectTopProductsBO(mockRecords, filters, 5);

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Monitor your field operations.
              </p>
            </div>
            <DateRangeFilter />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          <TodayAtGlance />

          <KpiStrip
            items={[
              {
                title: "Total Sales Today",
                primary: formatCurrencyPHP(kpis.totalSales),
                tone: "primary",
              },
              {
                title: "Avg Sales per Store",
                primary: formatCurrencyPHP(kpis.avgSalesPerStore),
              },
              {
                title: "Total Sold Today",
                primary: `${kpis.totalSoldQty} pcs`,
              },
              {
                title: "Total BO Today",
                primary: `${kpis.totalBOQty} `,
                secondary: formatCurrencyPHP(kpis.totalBOValue),
              },
              {
                title: "BO Rate",
                primary: formatPercent(kpis.boRate),
              },
            ]}
          />

          <div className="grid gap-6 xl:grid-cols-[7fr_3fr]">
            <ProjectAnalyticsChart />
            <TopProductsSoldTable products={topSold} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <TopProductsBOTable products={topBO} />
            <HighBOAgentsList agents={highBOAgents} />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
