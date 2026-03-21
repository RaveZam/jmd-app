"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { AddProductModal, type NewProduct } from "./components/AddProductModal";
import { ProductsHeader } from "./components/ProductsHeader";
import { ProductsTable, type ProductRow } from "./components/ProductsTable";
import { ProductsTableSkeleton } from "./components/ProductsTableSkeleton";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./services/productsService";

export function ProductPage(): ReactElement {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(next: NewProduct): Promise<void> {
    const created = await addProduct(next.name, next.price);
    setProducts((prev) => [created, ...prev]);
  }

  async function handleEdit(next: NewProduct): Promise<void> {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, next.name, next.price);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id ? { ...p, name: next.name, price: next.price } : p,
      ),
    );
    setEditingProduct(null);
  }

  async function handleDelete(id: string): Promise<void> {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <>
      <ProductsHeader
        onAddClick={() => setAddOpen(true)}
        productCount={products.length}
      />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-4">
          {loading ? (
            <ProductsTableSkeleton />
          ) : (
            <ProductsTable
              products={products}
              onEdit={setEditingProduct}
              onDelete={handleDelete}
              onAddClick={() => setAddOpen(true)}
            />
          )}
        </div>
      </div>

      {addOpen ? (
        <AddProductModal onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      ) : null}

      {editingProduct ? (
        <AddProductModal
          title="Edit Product"
          initialValues={{ name: editingProduct.name, price: editingProduct.price }}
          onClose={() => setEditingProduct(null)}
          onAdd={handleEdit}
        />
      ) : null}
    </>
  );
}

export default ProductPage;
