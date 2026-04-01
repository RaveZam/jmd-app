import { getRecords } from "@/app/server/getBaseData";
import { IntelligencePageClient } from "./components/IntelligencePageClient";
import { parseRecordsFiltersLast30Days } from "@/lib/selectors/filters";
import { getOneYearOfSalesData } from "./services/getOneYearOfSalesData";

export async function IntelligencePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseRecordsFiltersLast30Days(await searchParams);

  const params = await searchParams;
  const range = params["range"] ?? "weekly";
  const [data, yearData] = await Promise.all([
    getRecords(filters),
    range === "monthly" ? getOneYearOfSalesData() : Promise.resolve(null),
  ]);
  return <IntelligencePageClient data={data} yearData={yearData} />;
}

export default IntelligencePage;
