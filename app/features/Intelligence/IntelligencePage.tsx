import type { ReactElement } from "react";
import { mockRecords } from "@/lib/mock/records";
import { parseAdminFilters } from "@/lib/selectors/filters";
import { getDashboardSnapshot } from "@/lib/intelligence/snapshot";
import { runInsightRules } from "@/lib/intelligence/rules";
import { KpiCard } from "@/app/features/dashboard/components/phase1/KpiCard";
import { IntelligenceActionCard } from "@/app/features/Intelligence/components/IntelligenceActionCard";
import { IntelligenceForecastChart } from "@/app/features/Intelligence/components/IntelligenceForecastChart";
import { IntelligenceRangeDropdown } from "@/app/features/Intelligence/components/IntelligenceRangeDropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IntelligenceRiskChart } from "@/app/features/Intelligence/components/IntelligenceRiskChart";

function formatCurrencyPHP(value: number): string {
  return `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
function formatPercent(p: number): string {
  return `${(p * 100).toFixed(1)}%`;
}

function getBORiskLevel(boRate: number): "Low" | "Med" | "High" {
  if (boRate < 0.1) return "Low";
  if (boRate < 0.2) return "Med";
  return "High";
}
function getVarianceRiskLevel(
  varianceQty: number,
  avgVariance: number,
): "Low" | "Med" | "High" {
  const threshold = Math.max(5, avgVariance * 1.5);
  if (varianceQty <= 0) return "Low";
  if (varianceQty <= threshold) return "Med";
  return "High";
}

export async function IntelligencePage({
  searchParams,
}: {
  searchParams:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}): Promise<ReactElement> {
  const sp = await searchParams;
  const filters = parseAdminFilters(sp);
  const rawRange = Array.isArray(sp.range) ? sp.range[0] : sp.range;
  const rangeDays = rawRange === "30" ? 30 : 7;
  const snapshot = getDashboardSnapshot(mockRecords, {
    endDate: filters.date,
    rangeDays,
  });
  const actions = runInsightRules(snapshot);
  const p0Count = actions.filter((a) => a.priority === "P0").length;

  const last7 = snapshot.history.slice(-7);
  const avgRevenue = last7.length
    ? last7.reduce((s, h) => s + h.revenue, 0) / last7.length
    : 0;
  const avgVariance = last7.length
    ? last7.reduce((s, h) => s + h.varianceQty, 0) / last7.length
    : 0;
  const prevPeriodRevenue =
    snapshot.history.length >= 2
      ? snapshot.history[snapshot.history.length - 2]!.revenue
      : avgRevenue;
  const revenueTrendPct =
    prevPeriodRevenue > 0
      ? ((snapshot.totals.revenue - prevPeriodRevenue) / prevPeriodRevenue) *
        100
      : 0;
  const boRisk = getBORiskLevel(snapshot.totals.boRate);
  const varianceRisk = getVarianceRiskLevel(
    snapshot.totals.varianceQty,
    avgVariance,
  );

  const chartData = snapshot.history.map((h) => ({
    date: h.date,
    varianceQty: h.varianceQty,
    boRatePct: Math.round(h.boRate * 1000) / 10,
  }));

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
            <h2 className="mb-3 text-lg font-semibold">Next best actions</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {actions.length ? (
                actions.map((action) => (
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
                      .filter((a) => a.varianceQty > 0 || a.boRate > 0.1)
                      .sort(
                        (a, b) =>
                          Math.abs(b.varianceQty) - Math.abs(a.varianceQty) ||
                          b.boRate - a.boRate,
                      )
                      .map((a) => {
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
