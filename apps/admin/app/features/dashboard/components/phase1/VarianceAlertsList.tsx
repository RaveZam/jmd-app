import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VarianceAlertsList(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Variance alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Ben • 2026-02-21</p>
            <p className="mt-0.5 text-xs text-muted-foreground">2 rows • BO 20 • Variance 5</p>
          </div>
          <Badge variant="warning">-₱150</Badge>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Drew • 2026-02-21</p>
            <p className="mt-0.5 text-xs text-muted-foreground">2 rows • BO 4 • Variance 2</p>
          </div>
          <Badge variant="warning">-₱85</Badge>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Cara • 2026-02-21</p>
            <p className="mt-0.5 text-xs text-muted-foreground">2 rows • BO 3 • Variance 1</p>
          </div>
          <Badge variant="pending">-₱40</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
