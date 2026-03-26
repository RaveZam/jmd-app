import type { ReactElement } from "react";

import { KpiCard } from "@/app/features/dashboard/components/phase1/KpiCard";
import { IntelligenceActionCard } from "@/app/features/Intelligence/components/IntelligenceActionCard";
import { IntelligenceForecastChart } from "@/app/features/Intelligence/components/IntelligenceForecastChart";
import { IntelligenceRangeDropdown } from "@/app/features/Intelligence/components/IntelligenceRangeDropdown";
import { IntelligenceAgentForecast } from "@/app/features/Intelligence/components/IntelligenceAgentForecast";
import { IntelligenceProductForecast } from "@/app/features/Intelligence/components/IntelligenceProductForecast";

export async function IntelligencePage() {
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
                primary="+4.2%"
                secondary="Today ₱48,200"
                tone="primary"
              />
              <KpiCard
                title="Predicted sales tomorrow"
                primary="₱50,250"
                secondary="+4.3% vs today"
                tone="primary"
              />
              <KpiCard
                title="Avg sales next 7 days"
                primary="₱49,100"
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

export default IntelligencePage;
