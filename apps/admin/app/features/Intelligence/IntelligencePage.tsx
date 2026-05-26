import { getRecords } from "@/app/server/getBaseData";
import { IntelligencePageClient } from "./components/IntelligencePageClient";
import { parseRecordsFiltersLast30Days } from "@/lib/selectors/filters";
import { getOneYearOfSalesData } from "./services/getOneYearOfSalesData";
import { getAllDailySalesData } from "./services/getAllDailySalesData";
import {
  getProvincesByRevenue,
  getBarangaysByRevenue,
} from "../dashboard/services/revenueGeoService";

export async function IntelligencePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseRecordsFiltersLast30Days(await searchParams);

  const params = await searchParams;
  const range = params["range"] ?? "weekly";
  const [data, yearData, allTimeData, provinces, barangays] =
    await Promise.all([
      getRecords(filters),
      range === "monthly" ? getOneYearOfSalesData() : Promise.resolve(null),
      range === "yearly" ? getAllDailySalesData() : Promise.resolve(null),
      getProvincesByRevenue(),
      getBarangaysByRevenue(),
    ]);

  return (
    <IntelligencePageClient
      data={data}
      yearData={yearData}
      allTimeData={allTimeData}
      provinces={provinces}
      barangays={barangays}
    />
  );
}

export default IntelligencePage;
