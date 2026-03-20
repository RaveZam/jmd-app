import type { ReactElement } from "react";
import { CalendarDays, CheckCircle2, MapPin, Users } from "lucide-react";
import type { TodayGlance } from "../services/dashboardService";

function GlanceStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}): ReactElement {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold leading-tight tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}

export function TodayAtGlance({
  data,
}: {
  data: TodayGlance;
}): ReactElement {
  const storeProgress =
    data.totalStoresPlanned > 0
      ? `${data.storesVisited}/${data.totalStoresPlanned}`
      : "0";

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-wider text-muted-foreground">
        TODAY AT A GLANCE
      </p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <GlanceStat
          icon={CalendarDays}
          label="Sessions"
          value={data.totalSessions}
        />
        <GlanceStat
          icon={CheckCircle2}
          label="Completed"
          value={data.completedSessions}
        />
        <GlanceStat
          icon={MapPin}
          label="Stores Visited"
          value={storeProgress}
        />
        <GlanceStat
          icon={Users}
          label="Active Agents"
          value={data.activeAgents.length}
        />
      </div>
    </div>
  );
}
