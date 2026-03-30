"use client";
import { KpiCard } from "../../dashboard/components/phase1/KpiCard";
import { computeRevenueTodayAndYesterday } from "../helpers/computeRevenueTodayAndYesterday";
import { IntelligenceActionCard } from "./IntelligenceActionCard";
import { IntelligenceAgentForecast } from "./IntelligenceAgentForecast";
import { IntelligenceForecastChart } from "./IntelligenceForecastChart";
import { IntelligenceProductForecast } from "./IntelligenceProductForecast";
import { IntelligenceRangeDropdown } from "./IntelligenceRangeDropdown";
import { computeAverageSalesOnThatDay } from "../helpers/computeAverageSalesOnThatDay";

export function IntelligencePageClient({ data }: { data: any }) {
  const { totalSalesToday, totalSalesYesterday, percentageDiff } =
    computeRevenueTodayAndYesterday(data);
  const { predictedRevenueForTomorrow, dayToday } =
    computeAverageSalesOnThatDay(data);

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
                Health overview, predicted revenue, next best actions, and agent
                risk signals
              </p>
            </div>
            <IntelligenceRangeDropdown
              currentRange={7}
              currentDate="2026-03-26"
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
                primary={`${
                  percentageDiff >= 0 ? "+" : ""
                }${percentageDiff.toFixed(1)}%`}
                secondary={
                  "Today ₱" +
                  totalSalesToday +
                  " vs Yesterday ₱" +
                  totalSalesYesterday
                }
                tone="primary"
              />
              <KpiCard
                title={`Predicted sales tomorrow (${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(dayToday + 1) % 7]})`}
                primary={"₱" + predictedRevenueForTomorrow}
                secondary={`Your Average Sales On  ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(dayToday + 1) % 7]} for the past month`}
                tone="primary"
              />
              <KpiCard
                title="Projected 7 Day Revenue"
                primary="₱490,100"
                secondary="7-day projected average"
                tone="primary"
              />
              <KpiCard
                title="BO risk level"
                primary="Low"
                secondary="BO rate 8.0%"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Next best actions</h2>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-3">
              <IntelligenceActionCard
                action={{
                  id: "a-1",
                  title: "Reduce Spanish Bread allocation",
                  why: "BO rate hit 44% over the last 3 sessions — excess stock is not selling through.",
                  action:
                    "Cut delivery by 20% for next run and monitor sell-through.",
                  priority: "P1",
                  confidence: "High",
                }}
              />
              <IntelligenceActionCard
                action={{
                  id: "a-2",
                  title: "Follow up with Ben on variance discrepancy",
                  why: "5-unit variance recorded on 2026-02-21 with no return logged.",
                  action: "Request end-of-day reconciliation sheet from agent.",
                  priority: "P2",
                  confidence: "Med",
                }}
              />
              <IntelligenceActionCard
                action={{
                  id: "a-3",
                  title: "Increase Pandesal allocation at SM City",
                  why: "Consistently sells out — Angel's last 3 sessions show zero BO for this SKU.",
                  action:
                    "Add 10 units to next delivery and track for over-ordering.",
                  priority: "P2",
                  confidence: "Med",
                }}
              />
            </div>
          </section>

          <section>
            <IntelligenceForecastChart />
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
