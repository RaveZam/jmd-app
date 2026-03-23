import type { ReactElement } from "react";

import { ALL_SESSIONS, parseRecordsFilters } from "@/lib/selectors/filters";
import {
  buildRecordsPageUrl,
  getRecordsPageData,
} from "@/app/features/records/server/records-page-data";
import { fetchRecords } from "@/app/features/records/server/fetch-records";
import { fetchSessions } from "@/app/features/records/server/fetch-sessions";
import { RecordsClient } from "@/app/features/records/components/RecordsClient";

type SearchParams = Record<string, string | string[] | undefined>;

export async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}): Promise<ReactElement> {
  const sp = await searchParams;

  const [{ records, saleSessionMap }, sessions] = await Promise.all([
    fetchRecords(),
    fetchSessions(),
  ]);

  const filters = parseRecordsFilters(sp);

  const sessionSaleIds =
    filters.sessionId === ALL_SESSIONS
      ? null
      : new Set(
          [...saleSessionMap.entries()]
            .filter(([, sid]) => sid === filters.sessionId)
            .map(([saleId]) => saleId),
        );

  const data = getRecordsPageData(records, filters, sessionSaleIds, sp);

  return <RecordsClient data={data} sessions={sessions} sp={sp} buildUrl={buildRecordsPageUrl} />;
}

export default RecordsPage;
