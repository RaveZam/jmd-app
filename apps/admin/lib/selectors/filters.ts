export const ALL_AGENTS = "All" as const;

export type AdminFilters = {
  date: string; // YYYY-MM-DD (local)
  agent: string | typeof ALL_AGENTS;
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function formatLocalISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

const DEFAULT_DATE = "2026-02-21";

export const ALL_SESSIONS = "All" as const;

export type RecordsFilters = {
  dateFrom: string; // YYYY-MM-DD
  dateTo: string; // YYYY-MM-DD
  agent: string | typeof ALL_AGENTS;
  sessionId: string | typeof ALL_SESSIONS;
};

//filter parser by claude
export function parseRecordsFilters(
  searchParams: Record<string, string | string[] | undefined>,
): RecordsFilters {
  const first = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const dateFrom = first("dateFrom");
  const dateTo = first("dateTo");
  const agent = first("agent");
  const sessionId = first("sessionId");

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const todayStr = formatLocalISODate(today);
  const sevenDaysAgoStr = formatLocalISODate(sevenDaysAgo);

  return {
    dateFrom:
      dateFrom && /^\d{4}-\d{2}-\d{2}$/.test(dateFrom)
        ? dateFrom
        : sevenDaysAgoStr,
    dateTo: dateTo && /^\d{4}-\d{2}-\d{2}$/.test(dateTo) ? dateTo : todayStr,
    agent: agent && agent.trim() ? agent : ALL_AGENTS,
    sessionId: sessionId && sessionId.trim() ? sessionId : ALL_SESSIONS,
  };
}

export function parseAdminFilters(
  searchParams: Record<string, string | string[] | undefined>,
): AdminFilters {
  const rawDate = searchParams.date;
  const date = Array.isArray(rawDate) ? rawDate[0] : rawDate;

  const rawAgent = searchParams.agent;
  const agent = Array.isArray(rawAgent) ? rawAgent[0] : rawAgent;

  return {
    date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : DEFAULT_DATE,
    agent: agent && agent.trim() ? agent : ALL_AGENTS,
  };
}
