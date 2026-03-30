import { getRecords } from "@/app/server/getBaseData";
import { IntelligencePageClient } from "./components/IntelligencePageClient";
import { parseRecordsFiltersLast30Days } from "@/lib/selectors/filters";

export async function IntelligencePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseRecordsFiltersLast30Days(await searchParams);
  const data = await getRecords(filters);
  return <IntelligencePageClient data={data} />;
}

export default IntelligencePage;
