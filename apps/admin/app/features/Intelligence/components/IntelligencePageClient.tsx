"use client";
import { getIntelligenceMetrics } from "../helpers/getIntelligenceMetrics";
import { IntelligenceHeader } from "./panels/IntelligenceHeader";
import { BusinessHealthOverview } from "./panels/BusinessHealthOverview";
import { NextBestActions } from "./panels/NextBestActions";
import { ForecastSection } from "./panels/ForecastSection";
import { MorningInventoryInsights } from "./panels/MorningInventoryInsights";
import type { GeoRevenueRow } from "../../dashboard/services/revenueGeoService";

export function IntelligencePageClient({
  data,
  yearData,
  allTimeData,
  provinces,
  barangays,
}: {
  data: any;
  yearData: any;
  allTimeData: any;
  provinces: { province: string; revenue: number }[];
  barangays: GeoRevenueRow[];
}) {
  const metrics = getIntelligenceMetrics(data);

  return (
    <>
      <IntelligenceHeader />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          <BusinessHealthOverview metrics={metrics} />
          <NextBestActions />
          <ForecastSection
            data={data}
            yearData={yearData}
            allTimeData={allTimeData}
          />
          <MorningInventoryInsights
            provinces={provinces}
            barangays={barangays}
          />
        </div>
      </div>
    </>
  );
}
