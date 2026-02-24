import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LinearGradient } from "@visx/gradient";
import { Arc } from "@visx/shape";

function ProgressSvg({ p }: { p: number }): ReactElement {
  const w = 520;
  const h = 260;
  const cx = w / 2;
  const cy = 180;
  const outerRadius = 120;
  const thickness = 22;
  const innerRadius = outerRadius - thickness;
  const startAngle = (3 * Math.PI) / 2;
  const endAngle = startAngle + Math.PI;
  const progressEndAngle = startAngle + Math.PI * (p / 100);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[220px] w-full" role="img" aria-label={`Project progress ${p}%`}>
      <LinearGradient id="progGrad" from="#16a34a" to="#10b981" />
      <g transform={`translate(${cx},${cy})`}>
        <Arc startAngle={startAngle} endAngle={endAngle} innerRadius={innerRadius} outerRadius={outerRadius} fill="rgba(148,163,184,0.25)" cornerRadius={999} />
        <Arc startAngle={startAngle} endAngle={progressEndAngle} innerRadius={innerRadius} outerRadius={outerRadius} fill="url(#progGrad)" cornerRadius={999} />
      </g>
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="44" fontWeight="700" fill="rgba(15,23,42,1)">{p}%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="12" fill="rgba(100,116,139,1)">Project Ended</text>
    </svg>
  );
}

function Legend(): ReactElement {
  return (
    <div className="-mt-1 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-600" />
        Completed
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
        In Progress
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-slate-200" />
        Pending
      </span>
    </div>
  );
}

export function ProgressRing({
  percent = 41,
  className,
}: {
  percent?: number;
  className?: string;
}): ReactElement {
  const p = Math.max(0, Math.min(100, percent));

  return (
    <Card className={cn("shadow-soft", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ProgressSvg p={p} />
        <Legend />
      </CardContent>
    </Card>
  );
}

