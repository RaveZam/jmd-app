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

export function parseAdminFilters(searchParams: Record<string, string | string[] | undefined>): AdminFilters {
  const today = formatLocalISODate(new Date());

  const rawDate = searchParams.date;
  const date = Array.isArray(rawDate) ? rawDate[0] : rawDate;

  const rawAgent = searchParams.agent;
  const agent = Array.isArray(rawAgent) ? rawAgent[0] : rawAgent;

  return {
    date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today,
    agent: agent && agent.trim() ? agent : ALL_AGENTS,
  };
}

