import { parseRecordsFilters } from "@/lib/selectors/filters";
import {
  buildRecordsPageUrl,
  getRecordsPageData,
} from "@/app/features/records/server/records-page-data";
import { getRecords } from "@/app/server/getBaseData";
import { fetchSessions } from "@/app/features/records/server/fetch-sessions";
import { RecordsClient } from "@/app/features/records/components/RecordsClient";
import type { LedgerRecord } from "@/app/features/records/types";

type SearchParams = Record<string, string | string[] | undefined>;

function toRecords(raw: Awaited<ReturnType<typeof getRecords>>): LedgerRecord[] {
  return raw.map((r) => ({
    ...r,
    lineTotal: r.soldQty * r.unitPrice,
  }));
}

export async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const sp = await searchParams;
  const filters = parseRecordsFilters(sp);

  const [rawRecords, sessions] = await Promise.all([
    getRecords(filters),
    fetchSessions(),
  ]);

  const records = toRecords(rawRecords);
  const data = getRecordsPageData(records, filters, sp);

  return (
    <RecordsClient
      data={data}
      sessions={sessions}
      sp={sp}
      buildUrl={buildRecordsPageUrl}
    />
  );
}

export default RecordsPage;
