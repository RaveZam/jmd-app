import type { ReactElement } from "react";
import { mockRecords } from "@/lib/mock/records";
import { buildIntelligenceContext } from "../../../lib/intelligence/compute";
import { KpiCard } from "@/app/features/dashboard/components/phase1/KpiCard";
import { IntelligenceActionCard } from "@/app/features/Intelligence/components/IntelligenceActionCard";
import { IntelligenceForecastChart } from "@/app/features/Intelligence/components/IntelligenceForecastChart";
import { IntelligenceRangeDropdown } from "@/app/features/Intelligence/components/IntelligenceRangeDropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IntelligenceRiskChart } from "@/app/features/Intelligence/components/IntelligenceRiskChart";
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
    p0Count,
    revenueTrendPct,
    boRisk,
    varianceRisk,
    chartData,
  } = await buildIntelligenceContext(searchParams, mockRecords);

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Route Intelligence
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Actionable insights based on your sales + BO + variance
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
                title="BO risk level"
                primary={boRisk}
                secondary={`BO rate ${formatPercent(snapshot.totals.boRate)}`}
              />
              <KpiCard
                title="Variance risk level"
                primary={varianceRisk}
                secondary={`${snapshot.totals.varianceQty} pcs today`}
              />
              <KpiCard
                title="Attention required"
                primary={String(p0Count)}
                secondary={p0Count === 1 ? "P0 action" : "P0 actions"}
                tone={p0Count > 0 ? "primary" : "neutral"}
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
            <h2 className="mb-3 text-lg font-semibold">Risk & anomalies</h2>
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Agents at risk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {snapshot.agents.length ? (
                    snapshot.agents
                      .filter((a: any) => a.varianceQty > 0 || a.boRate > 0.1)
                      .sort(
                        (a: any, b: any) =>
                          Math.abs(b.varianceQty) - Math.abs(a.varianceQty) ||
                          b.boRate - a.boRate,
                      )
                      .map((a: any) => {
                        const risk =
                          a.varianceQty > 10 || a.boRate > 0.2
                            ? "High"
                            : a.varianceQty > 0 || a.boRate > 0.1
                              ? "Med"
                              : "Low";
                        return (
                          <div
                            key={a.id}
                            className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {a.name}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Variance {a.varianceQty} · BO{" "}
                                {formatPercent(a.boRate)} ·{" "}
                                {formatCurrencyPHP(a.revenue)}
                              </p>
                            </div>
                            <Badge
                              variant={
                                risk === "High"
                                  ? "warning"
                                  : risk === "Med"
                                    ? "secondary"
                                    : "pending"
                              }
                            >
                              {risk}
                            </Badge>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No agent risk data for this period.
                    </p>
                  )}
                </CardContent>
              </Card>

              <IntelligenceRiskChart data={chartData} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default IntelligencePage;
