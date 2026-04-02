import type { ReactElement } from "react";

import { ALL_SESSIONS, parseRecordsFilters } from "@/lib/selectors/filters";
import {
  buildRecordsPageUrl,
  getRecordsPageData,
} from "@/app/features/records/server/records-page-data";
import { getRecords } from "@/app/server/getBaseData";
import { fetchSessions } from "@/app/features/records/server/fetch-sessions";
import { RecordsClient } from "@/app/features/records/components/RecordsClient";

type SearchParams = Record<string, string | string[] | undefined>;

export async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const sp = await searchParams;
  const filters = parseRecordsFilters(sp);

  const [records, sessions] = await Promise.all([
    getRecords(filters),
    fetchSessions(),
  ]);

  const saleSessionMap = new Map(records.map((r) => [r.id, r.sessionId]));

  const sessionSaleIds =
    filters.sessionId === ALL_SESSIONS
      ? null
      : new Set(
          [...saleSessionMap.entries()]
            .filter(([, sid]) => sid === filters.sessionId)
            .map(([saleId]) => saleId),
        );

  const data = getRecordsPageData(records, filters, sessionSaleIds, sp);

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
