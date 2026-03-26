import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HighBOAgentsList(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">High BO agents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Ben</p>
            <p className="mt-0.5 text-xs text-muted-foreground">BO 20 • Sold 25</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">44.4%</Badge>
            <Badge variant="pending">₱600</Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Angel</p>
            <p className="mt-0.5 text-xs text-muted-foreground">BO 5 • Sold 52</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">8.8%</Badge>
            <Badge variant="pending">₱275</Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Drew</p>
            <p className="mt-0.5 text-xs text-muted-foreground">BO 4 • Sold 41</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">8.9%</Badge>
            <Badge variant="pending">₱255</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
