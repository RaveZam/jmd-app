"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  ALL_AGENTS,
  ALL_SESSIONS,
  formatLocalISODate,
  type RecordsFilters,
} from "@/lib/selectors/filters";
import type { RouteSession } from "@/app/features/records/server/fetch-sessions";

type RecordsFiltersBarProps = {
  agents: string[];
  sessions: RouteSession[];
  filtersDefault: RecordsFilters;
};

function getMonday(d: Date): Date {
  const day = d.getDay(); // 0 = Sun, 1 = Mon...
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday;
}

export function RecordsFiltersBar({
  agents,
  sessions,
  filtersDefault,
}: RecordsFiltersBarProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const dateFrom = sp.get("dateFrom") ?? filtersDefault.dateFrom;
  const dateTo = sp.get("dateTo") ?? filtersDefault.dateTo;
  const agent = sp.get("agent") ?? filtersDefault.agent;
  const sessionId = sp.get("sessionId") ?? filtersDefault.sessionId;

  function push(updates: Partial<Record<string, string>>) {
    const params = new URLSearchParams(sp.toString());
    params.delete("date"); // drop legacy param
    params.set("page", "1");
    for (const [k, v] of Object.entries(updates)) {
      params.set(k, v ?? "");
    }
    router.push(`/records?${params.toString()}`);
  }

  function setDateRange(from: string, to: string) {
    push({ dateFrom: from, dateTo: to });
  }

  const today = formatLocalISODate(new Date());
  const yesterday = formatLocalISODate(
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d;
    })(),
  );
  const thisWeekStart = formatLocalISODate(getMonday(new Date()));

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card px-4 py-3">
      {/* Date range */}
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => push({ dateFrom: e.target.value })}
            className="h-9 rounded-xl border bg-background px-3 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => push({ dateTo: e.target.value })}
            className="h-9 rounded-xl border bg-background px-3 text-sm"
          />
        </div>
      </div>

      {/* Quick buttons */}
      <div className="flex items-center gap-1 self-end pb-px">
        <button
          type="button"
          onClick={() => setDateRange(today, today)}
          className="rounded-xl border px-3 py-2 text-xs hover:bg-muted"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setDateRange(yesterday, yesterday)}
          className="rounded-xl border px-3 py-2 text-xs hover:bg-muted"
        >
          Yesterday
        </button>
        <button
          type="button"
          onClick={() => setDateRange(thisWeekStart, today)}
          className="rounded-xl border px-3 py-2 text-xs hover:bg-muted"
        >
          This Week
        </button>
      </div>

      {/* Agent */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Agent
        </label>
        <select
          value={agent}
          onChange={(e) => push({ agent: e.target.value })}
          className="h-9 rounded-xl border bg-background px-3 text-sm"
        >
          <option value={ALL_AGENTS}>All agents</option>
          {agents.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Session */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Session
        </label>
        <select
          value={sessionId}
          onChange={(e) => push({ sessionId: e.target.value })}
          className="h-9 rounded-xl border bg-background px-3 text-sm"
        >
          <option value={ALL_SESSIONS}>All sessions</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.routeName} — {s.sessionDate} ({s.agentName})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
