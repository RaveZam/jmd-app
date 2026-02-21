"use client";

import type { ReactElement } from "react";
import { useState } from "react";

import { AddProductModal, type NewProduct } from "./components/AddProductModal";
import { ProductsHeader } from "./components/ProductsHeader";
import { ProductsTable, type ProductRow } from "./components/ProductsTable";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ProductPage(): ReactElement {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>(() => [{ id: createId(), name: "Pandesal", price: 8 }]);

  function addProduct(next: NewProduct): void {
    setProducts((prev) => [{ id: createId(), ...next }, ...prev]);
  }

  return (
    <>
      <ProductsHeader onAddClick={() => setOpen(true)} />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          <ProductsTable products={products} />
        </div>
      </div>

      {open ? <AddProductModal onClose={() => setOpen(false)} onAdd={addProduct} /> : null}
    </>
  );
}

export default ProductPage;
