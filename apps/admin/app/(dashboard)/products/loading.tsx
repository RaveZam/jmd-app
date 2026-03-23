import type { ReactElement } from "react";
import { ProductsTableSkeleton } from "@/app/features/products/components/ProductsTableSkeleton";

export default function Loading(): ReactElement {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto w-full max-w-[1200px] space-y-4">
        <ProductsTableSkeleton />
      </div>
    </div>
  );
}
