import type { ReactElement } from "react";
import { KpiCard } from "./KpiCard";

export function KpiStrip(): ReactElement {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <KpiCard title="Total Sales Today" primary="₱0" tone="primary" />
      <KpiCard title="Avg Sales per Store" primary="₱0" />
      <KpiCard title="Total Sold Today" primary="0 pcs" />
      <KpiCard title="Total BO Today" primary="0" secondary="₱0" />
      <KpiCard title="BO Rate" primary="0%" />
    </div>
  );
}
