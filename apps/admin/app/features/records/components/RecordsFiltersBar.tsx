"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
  const day = d.getDay();
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
    params.delete("date");
    params.set("page", "1");
    for (const [k, v] of Object.entries(updates)) {
      params.set(k, v ?? "");
    }
    router.push(`/records?${params.toString()}`);
  }

  function toggleDateRange(from: string, to: string) {
    const params = new URLSearchParams(sp.toString());
    params.delete("date");
    params.set("page", "1");
    if (dateFrom === from && dateTo === to) {
      params.delete("dateFrom");
      params.delete("dateTo");
    } else {
      params.set("dateFrom", from);
      params.set("dateTo", to);
    }
    router.push(`/records?${params.toString()}`);
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

  const isToday = dateFrom === today && dateTo === today;
  const isYesterday = dateFrom === yesterday && dateTo === yesterday;
  const isThisWeek = dateFrom === thisWeekStart && dateTo === today;

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-2xl border bg-card px-5 py-4 shadow-sm">
      {/* Date range group */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            From
          </label>
          <div className="relative flex items-center">
            <Calendar className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => push({ dateFrom: e.target.value })}
              className="h-9 rounded-xl border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <span className="mb-2 text-muted-foreground">—</span>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            To
          </label>
          <div className="relative flex items-center">
            <Calendar className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => push({ dateTo: e.target.value })}
              className="h-9 rounded-xl border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Quick preset pills */}
        <div className="flex items-center self-end rounded-xl border bg-muted/40 p-0.5">
          {[
            { label: "Today", active: isToday, onClick: () => toggleDateRange(today, today) },
            { label: "Yesterday", active: isYesterday, onClick: () => toggleDateRange(yesterday, yesterday) },
            { label: "This Week", active: isThisWeek, onClick: () => toggleDateRange(thisWeekStart, today) },
          ].map(({ label, active, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="hidden h-9 w-px self-end bg-border md:block" />

      {/* Agent & Session selects */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Agent
          </label>
          <div className="relative flex items-center">
            <select
              value={agent}
              onChange={(e) => push({ agent: e.target.value })}
              className="h-9 appearance-none rounded-xl border bg-background pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={ALL_AGENTS}>All agents</option>
              {agents.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Session
          </label>
          <div className="relative flex items-center">
            <select
              value={sessionId}
              onChange={(e) => push({ sessionId: e.target.value })}
              className="h-9 appearance-none rounded-xl border bg-background pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={ALL_SESSIONS}>All sessions</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.routeName} — {s.sessionDate} ({s.agentName})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
