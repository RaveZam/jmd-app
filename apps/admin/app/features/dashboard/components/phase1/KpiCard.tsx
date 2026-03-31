"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

const toneStyles: Record<
  string,
  { card: string; label: string; sub: string; icon: string }
> = {
  primary: {
    card: "border-transparent bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white",
    label: "text-emerald-50/90",
    sub: "text-emerald-50/80",
    icon: "text-emerald-50/70",
  },
  healthy: {
    card: "border-transparent bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white",
    label: "text-emerald-50/90",
    sub: "text-emerald-50/80",
    icon: "text-emerald-50/70",
  },
  medium: {
    card: "border-transparent bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500 text-white",
    label: "text-amber-50/90",
    sub: "text-amber-50/80",
    icon: "text-amber-50/70",
  },
  warning: {
    card: "border-transparent bg-gradient-to-br from-orange-800 via-orange-700 to-orange-600 text-white",
    label: "text-orange-50/90",
    sub: "text-orange-50/80",
    icon: "text-orange-50/70",
  },
  critical: {
    card: "border-transparent bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-white",
    label: "text-red-50/90",
    sub: "text-red-50/80",
    icon: "text-red-50/70",
  },
  neutral: {
    card: "",
    label: "text-muted-foreground",
    sub: "text-muted-foreground",
    icon: "text-muted-foreground",
  },
};

export function KpiCard({
  title,
  primary,
  secondary,
  tone = "neutral",
  icon: Icon,
}: {
  title: string;
  primary: string;
  secondary?: string;
  tone?: "neutral" | "primary" | "healthy" | "medium" | "warning" | "critical";
  icon?: LucideIcon;
}) {
  const styles = toneStyles[tone] ?? toneStyles.neutral;
  return (
    <Card className={cn("shadow-soft", styles.card)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className={cn("text-sm font-medium", styles.label)}>{title}</p>
          {Icon && (
            <Icon className={cn("h-5 w-5 shrink-0", styles.icon)} />
          )}
        </div>
        <p className="mt-2 text-3xl font-semibold leading-none tracking-tight">
          {primary}
        </p>
        {secondary ? (
          <p className={cn("mt-3 text-xs", styles.sub)}>{secondary}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
