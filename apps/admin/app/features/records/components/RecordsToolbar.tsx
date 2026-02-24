"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownWideNarrow, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RecordsToolbarProps = {
  defaultQuery: string;
  defaultSort: string;
};

function setOrDeleteParam(params: URLSearchParams, key: string, value: string | null) {
  if (!value) params.delete(key);
  else params.set(key, value);
}

export function RecordsToolbar({
  defaultQuery,
  defaultSort,
}: RecordsToolbarProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(defaultQuery);

  const currentSort = searchParams.get("sort") ?? defaultSort;

  const nextSort = useMemo(() => {
    return currentSort === "varianceAsc" ? "varianceDesc" : "varianceAsc";
  }, [currentSort]);

  function navigate(next: URLSearchParams) {
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-[420px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search store or product"
          value={value}
          onChange={(e) => {
            const nextValue = e.target.value;
            setValue(nextValue);

            const next = new URLSearchParams(searchParams.toString());
            setOrDeleteParam(next, "q", nextValue.trim() ? nextValue : null);
            next.set("page", "1");
            navigate(next);
          }}
          className="rounded-2xl pl-9 shadow-soft"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl"
          onClick={() => {
            const next = new URLSearchParams(searchParams.toString());
            next.set("sort", nextSort);
            next.set("page", "1");
            navigate(next);
          }}
        >
          <ArrowDownWideNarrow className="h-4 w-4" />
          Sort: variance
        </Button>
      </div>
    </div>
  );
}

