import type { ReactElement } from "react";
import type { AdminRow } from "../types/admin-types";
import { AdminCard } from "./AdminCard";
import { AdminCardSkeleton } from "./AdminCardSkeleton";

export function AdminGrid({
  admins,
  loading,
  onDelete,
}: {
  admins: AdminRow[];
  loading: boolean;
  onDelete: (id: string) => void;
}): ReactElement {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AdminCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{admins.length}</span>{" "}
        {admins.length === 1 ? "admin" : "admins"}
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {admins.map((admin) => (
          <AdminCard key={admin.id} admin={admin} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
