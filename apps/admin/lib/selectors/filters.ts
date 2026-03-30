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

export const ALL_SESSIONS = "All" as const;

export type RecordsFilters = {
  dateFrom: string; // YYYY-MM-DD
  dateTo: string; // YYYY-MM-DD
  agent: string | typeof ALL_AGENTS;
  sessionId: string | typeof ALL_SESSIONS;
};

function first(
  sp: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatLocalISODate(d);
}

export function parseRecordsFilters(
  searchParams: Record<string, string | string[] | undefined>,
): RecordsFilters {
  return {
    dateFrom: first(searchParams, "dateFrom") ?? daysAgo(6),
    dateTo: first(searchParams, "dateTo") ?? daysAgo(0),
    agent: first(searchParams, "agent") ?? ALL_AGENTS,
    sessionId: first(searchParams, "sessionId") ?? ALL_SESSIONS,
  };
}

export function parseRecordsFiltersLast30Days(
  searchParams: Record<string, string | string[] | undefined>,
): RecordsFilters {
  return {
    ...parseRecordsFilters(searchParams),
    dateFrom: first(searchParams, "dateFrom") ?? daysAgo(30),
  };
}

export function parseAdminFilters(
  searchParams: Record<string, string | string[] | undefined>,
): AdminFilters {
  return {
    date: first(searchParams, "date") ?? daysAgo(0),
    agent: first(searchParams, "agent") ?? ALL_AGENTS,
  };
}
