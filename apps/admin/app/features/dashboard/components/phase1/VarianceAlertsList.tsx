import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VarianceAlert } from "@/lib/selectors/metrics";

function formatCurrencyPHP(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  return `${sign}₱${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function VarianceAlertsList({
  alerts,
  limit = 6,
}: {
  alerts: VarianceAlert[];
  limit?: number;
}): ReactElement {
  const sliced = alerts.slice(0, limit);

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Variance alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sliced.length ? (
          sliced.map((a) => (
            <div
              key={`${a.agent}-${a.date}`}
              className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {a.agent} • {a.date}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {a.rows} rows • BO {a.boQty} • Variance {a.varianceQty}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.varianceQty === 0 ? "pending" : "warning"}>
                  {formatCurrencyPHP(a.varianceValue)}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No alerts for this filter.</p>
        )}
      </CardContent>
    </Card>
  );
}

