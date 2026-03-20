import type { ReactElement } from "react";
import { CheckCircle2, Circle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SessionRow, SessionStoreRow } from "../types/session-types";
import { formatSessionDate, visitRate } from "../helpers/sessionHelpers";
import { formatAddress } from "@/app/features/stores/helpers/storeHelpers";

function StoreItem({ store }: { store: SessionStoreRow }): ReactElement {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background px-3 py-2.5">
      {store.visited ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{store.storeName}</p>
        <p className="text-xs text-muted-foreground">
          {formatAddress(store.barangay, store.city, store.province)}
        </p>
      </div>
      <Badge variant={store.visited ? "success" : "pending"}>
        {store.visited ? "Visited" : "Pending"}
      </Badge>
    </div>
  );
}

export function SessionStoreList({
  session,
  stores,
  loading,
}: {
  session: SessionRow;
  stores: SessionStoreRow[];
  loading: boolean;
}): ReactElement {
  const rate = visitRate(session.visitedStores, session.totalStores);

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{session.routeName}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {formatSessionDate(session.sessionDate)} &middot;{" "}
          {session.conductedByName} &middot;{" "}
          <span className="font-medium text-foreground">{rate}</span> visit rate
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading stores...
          </p>
        ) : stores.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No stores in this session.
          </p>
        ) : (
          stores.map((store) => <StoreItem key={store.id} store={store} />)
        )}
      </CardContent>
    </Card>
  );
}
