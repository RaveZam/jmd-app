import type { ReactElement } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProductsHeader({
  onAddClick,
  productCount,
}: {
  onAddClick: () => void;
  productCount: number;
}): ReactElement {
  return (
    <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
      <div className="mx-auto w-full max-w-[1200px] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium text-muted-foreground">
                {productCount}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your product catalog and pricing.
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

