import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HighBOAgent } from "@/lib/selectors/metrics";

function formatCurrencyPHP(value: number): string {
  return `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatPercent(p: number): string {
  return `${(p * 100).toFixed(1)}%`;
}

export function HighBOAgentsList({
  agents,
  limit = 6,
}: {
  agents: HighBOAgent[];
  limit?: number;
}): ReactElement {
  const sliced = agents.slice(0, limit);

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">High BO agents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sliced.length ? (
          sliced.map((a) => (
            <div
              key={a.agent}
              className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{a.agent}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  BO {a.boQty} • Sold {a.soldQty}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">{formatPercent(a.boRate)}</Badge>
                <Badge variant="pending">{formatCurrencyPHP(a.boValue)}</Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No BO spikes for this filter.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

