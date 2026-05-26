import { TrendingUp, TrendingDown, CalendarDays, BarChart2 } from "lucide-react";
import { KpiCard } from "../../../dashboard/components/KpiCard";
import type { IntelligenceMetrics } from "../../helpers/getIntelligenceMetrics";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function BusinessHealthOverview({
  metrics,
}: {
  metrics: IntelligenceMetrics;
}) {
  const {
    totalSalesToday,
    totalSalesYesterday,
    percentageDiff,
    predictedRevenueForTomorrow,
    dayToday,
    averageSalesNextWeek,
    borate,
    boRisk,
  } = metrics;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Business health overview</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Revenue trend vs previous day"
          primary={`${percentageDiff >= 0 ? "+" : ""}${percentageDiff.toFixed(1)}%`}
          secondary={`Today ₱${totalSalesToday} vs Yesterday ₱${totalSalesYesterday}`}
          tone="primary"
          icon={percentageDiff >= 0 ? TrendingUp : TrendingDown}
        />
        <KpiCard
          title="Predicted sales Tomorrow"
          primary={`₱${isNaN(predictedRevenueForTomorrow) ? 0 : predictedRevenueForTomorrow}`}
          secondary={`Your Typical Sales On  ${WEEKDAYS[(dayToday + 1) % 7]}`}
          tone="primary"
          icon={CalendarDays}
        />
        <KpiCard
          title="Projected 7 Day Revenue"
          primary={`₱${Math.round(averageSalesNextWeek).toLocaleString()}`}
          secondary="Based From your weekly Sales This Month"
          tone="primary"
          icon={BarChart2}
        />
        <KpiCard
          title="BO risk level"
          primary={boRisk.label}
          secondary={`BO Rate ${borate.toFixed(1)}% This Month`}
          tone={boRisk.tone}
          icon={boRisk.icon}
        />
      </div>
    </section>
  );
}
