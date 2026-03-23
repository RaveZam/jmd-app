import type { ReactElement } from "react";
import { CheckCircle2, Info, MapPin, Route, Users } from "lucide-react";
import { PortalTooltip } from "@/components/ui/portal-tooltip";

function GlanceStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint?: string;
}): ReactElement {
  return (
    <div className="relative flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold leading-tight tabular-nums">
          {value}
        </p>
      </div>
      {hint && (
        <div className="absolute right-3 top-1">
          <PortalTooltip content={hint}>
            <Info className="h-3 w-3 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors" />
          </PortalTooltip>
        </div>
      )}
    </div>
  );
}

export function TodayAtGlance(): ReactElement {
  return (
    <div className="space-y-2">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <GlanceStat
          icon={MapPin}
          label="Stores Visited"
          value="12 / 48"
          hint="Stores checked in today"
        />
        <GlanceStat
          icon={Users}
          label="Agents in Field"
          value="3 / 5"
          hint="Agents with active sessions"
        />
        <GlanceStat
          icon={Route}
          label="Ongoing Routes"
          value="2"
          hint="Routes currently in progress"
        />
        <GlanceStat
          icon={CheckCircle2}
          label="Completion Rate"
          value="67%"
          hint="Tendered ÷ planned stores"
        />
      </div>
    </div>
  );
}
