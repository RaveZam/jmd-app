"use client";

import type { ReactElement } from "react";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FiltersBarProps = {
  agents: string[];
  dateDefault: string; // YYYY-MM-DD
  agentDefault: string; // "All"
  className?: string;
};

function setOrDeleteParam(
  params: URLSearchParams,
  key: string,
  value: string | null
) {
  if (!value) params.delete(key);
  else params.set(key, value);
}

function todayLocalISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function shiftLocalDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function FiltersBar({
  agents,
  dateDefault,
  agentDefault,
  className,
}: FiltersBarProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentDate = searchParams.get("date") ?? dateDefault;
  const currentAgent = searchParams.get("agent") ?? agentDefault;

  const agentOptions = useMemo(() => {
    const unique = Array.from(
      new Set(agents.map((a) => a.trim()).filter(Boolean))
    );
    unique.sort((a, b) => a.localeCompare(b));
    return unique;
  }, [agents]);

  function navigate(next: URLSearchParams) {
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card px-4 py-3 shadow-soft md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="grid w-full gap-3 md:grid-cols-[200px_220px] md:items-end">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Date</p>
          <Input
            type="date"
            value={currentDate}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams.toString());
              setOrDeleteParam(next, "date", e.target.value || null);
              next.set("page", "1");
              navigate(next);
            }}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Agent</p>
          <select
            value={currentAgent}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams.toString());
              const value = e.target.value;
              setOrDeleteParam(
                next,
                "agent",
                value === agentDefault ? null : value
              );
              next.set("page", "1");
              navigate(next);
            }}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value={agentDefault}>{agentDefault}</option>
            {agentOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl"
          onClick={() => {
            const today = todayLocalISO();
            const next = new URLSearchParams(searchParams.toString());
            next.set("date", today);
            next.set("page", "1");
            navigate(next);
          }}
        >
          Today
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl"
          onClick={() => {
            const next = new URLSearchParams(searchParams.toString());
            const base = searchParams.get("date") ?? dateDefault;
            next.set("date", shiftLocalDays(base, -1));
            next.set("page", "1");
            navigate(next);
          }}
        >
          Yesterday
        </Button>
      </div>
    </div>
  );
}

