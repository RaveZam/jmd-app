import type { ReactElement } from "react";
import { CalendarDays, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AdminRow } from "../types/admin-types";

const AVATAR_COLORS = [
  "bg-blue-200 text-blue-800",
  "bg-violet-200 text-violet-800",
  "bg-rose-200 text-rose-800",
  "bg-amber-200 text-amber-800",
  "bg-emerald-200 text-emerald-800",
  "bg-cyan-200 text-cyan-800",
  "bg-pink-200 text-pink-800",
  "bg-orange-200 text-orange-800",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AdminCard({
  admin,
  onDelete,
}: {
  admin: AdminRow;
  onDelete: (id: string) => void;
}): ReactElement {
  const joined = new Date(admin.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(admin.name)}`}
            >
              {initials(admin.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{admin.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {admin.email}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-red-600"
            onClick={() => onDelete(admin.id)}
            aria-label={`Delete ${admin.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          Joined {joined}
        </p>
      </CardContent>
    </Card>
  );
}
