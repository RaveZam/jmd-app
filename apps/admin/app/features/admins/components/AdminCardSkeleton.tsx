import type { ReactElement } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminCardSkeleton(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Skeleton className="mt-4 h-3.5 w-32" />
      </CardContent>
    </Card>
  );
}
