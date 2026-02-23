import type { ReactElement } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InsightAction } from "@/lib/intelligence/types";

const priorityVariant = {
  P0: "warning" as const,
  P1: "secondary" as const,
  P2: "pending" as const,
  P3: "warning" as const,
};
const confidenceVariant = {
  High: "success" as const,
  Med: "default" as const,
  Low: "pending" as const,
  Critical: "warning" as const,
};

export function IntelligenceActionCard({
  action,
}: {
  action: InsightAction;
}): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardContent className="p-5">
        <h3 className="mt-3 text-base font-semibold leading-tight">
          {action.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{action.why}</p>
        <p className="mt-2 text-xs font-medium text-foreground">
          Next step: {action.action}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <Badge variant={priorityVariant[action.priority]}>
            {action.priority}
          </Badge>
          <Badge variant={confidenceVariant[action.confidence]}>
            {action.confidence}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
