import type { ReactElement } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProductsHeader({ onAddClick }: { onAddClick: () => void }): ReactElement {
  return (
    <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur">
      <div className="mx-auto w-full max-w-[1200px] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Simple list (temporary in-memory).
            </p>
          </div>
          <Button type="button" className="rounded-2xl" onClick={onAddClick}>
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>
    </header>
  );
}

