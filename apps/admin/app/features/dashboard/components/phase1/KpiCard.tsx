"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function KpiCard({
  title,
  primary,
  secondary,
  tone = "neutral",
}: {
  title: string;
  primary: string;
  secondary?: string;
  tone?: "neutral" | "primary";
}) {
  return (
    <Card
      className={cn(
        "shadow-soft",
        tone === "primary" &&
          "border-transparent bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white",
      )}
    >
      <CardContent className="p-5">
        <p
          className={cn(
            "text-sm font-medium",
            tone === "primary" ? "text-emerald-50/90" : "text-muted-foreground",
          )}
        >
          {title}
        </p>
        <p className="mt-2 text-3xl font-semibold leading-none tracking-tight">
          {primary}
        </p>
        {secondary ? (
          <p
            className={cn(
              "mt-3 text-xs",
              tone === "primary"
                ? "text-emerald-50/80"
                : "text-muted-foreground",
            )}
          >
            {secondary}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
