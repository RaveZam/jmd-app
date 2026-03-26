import type { ReactElement } from "react";
import { mockRecords } from "@/lib/mock/records";
import { buildIntelligenceContext } from "../../../lib/intelligence/compute";
import { KpiCard } from "@/app/features/dashboard/components/phase1/KpiCard";
import { IntelligenceActionCard } from "@/app/features/Intelligence/components/IntelligenceActionCard";
import { IntelligenceForecastChart } from "@/app/features/Intelligence/components/IntelligenceForecastChart";
import { IntelligenceRangeDropdown } from "@/app/features/Intelligence/components/IntelligenceRangeDropdown";
import { IntelligenceAgentForecast } from "@/app/features/Intelligence/components/IntelligenceAgentForecast";
import { IntelligenceProductForecast } from "@/app/features/Intelligence/components/IntelligenceProductForecast";
import {
  formatCurrencyPHP,
  formatPercent,
} from "@/app/features/Intelligence/helpers";

export async function IntelligencePage({
  searchParams,
}: {
  searchParams:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}): Promise<ReactElement> {
  const {
    filters,
    rangeDays,
    snapshot,
    actions,
    revenueTrendPct,
    boRisk,
  } = await buildIntelligenceContext(searchParams, mockRecords);

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Intelligence
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Health overview, predicted revenue, next best actions, and agent risk signals
              </p>
            </div>
            <IntelligenceRangeDropdown
              currentRange={rangeDays === 30 ? 30 : 7}
              currentDate={filters.date}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Business health overview
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Revenue trend vs previous day"
                primary={
                  revenueTrendPct >= 0
                    ? `+${revenueTrendPct.toFixed(1)}%`
                    : `${revenueTrendPct.toFixed(1)}%`
                }
                secondary={
                  snapshot.totals.revenue > 0
                    ? `Today ${formatCurrencyPHP(snapshot.totals.revenue)}`
                    : undefined
                }
                tone={revenueTrendPct >= 0 ? "primary" : "neutral"}
              />
              <KpiCard
                title="Predicted sales tomorrow"
                primary="₱24,810"
                secondary="+3.2% vs today"
                tone="primary"
              />
              <KpiCard
                title="Avg sales next 7 days"
                primary="₱23,450"
                secondary="7-day projected average"
                tone="primary"
              />
              <KpiCard
                title="BO risk level"
                primary={boRisk}
                secondary={`BO rate ${formatPercent(snapshot.totals.boRate)}`}
              />
            </div>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-semibold">Next best actions</h2>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-3">
              {actions.length ? (
                actions
                  .slice(0, 3)
                  .map((action: any) => (
                    <IntelligenceActionCard key={action.id} action={action} />
                  ))
              ) : (
                <Card className="shadow-soft">
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">
                      No priority actions right now.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <section>
            <IntelligenceForecastChart snapshot={snapshot} />
          </section>

          <section>
            <IntelligenceAgentForecast />
          </section>

          <section>
            <IntelligenceProductForecast />
          </section>

        </div>
      </div>
    </>
  );
}

export default IntelligencePage;
