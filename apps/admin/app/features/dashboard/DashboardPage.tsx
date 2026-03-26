import { DashboardClient } from "./components/DashboardClient";
import { getRecords } from "./services/base/getBaseData";
import { parseRecordsFilters } from "@/lib/selectors/filters";

export async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseRecordsFilters(await searchParams);
  const data = await getRecords(filters);

  return <DashboardClient data={data} />;
}

export default DashboardPage;
