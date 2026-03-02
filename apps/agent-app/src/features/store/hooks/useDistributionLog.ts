import { useState, useCallback } from "react";
import type { Product } from "../mock/products";

export type LoggedItem = {
  productId: string;
  productName: string;
  price: number;
  qty: number;
  boQty: number;
};

export function useDistributionLog(products: Product[]) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [qty, setQty] = useState(1);
  const [boQty, setBoQty] = useState(0);
  const [loggedItems, setLoggedItems] = useState<LoggedItem[]>([]);

  const selectedProduct =
    selectedProductId === null
      ? null
      : products.find((p) => p.id === selectedProductId) ?? null;

  const onSelectProduct = useCallback((product: Product) => {
    setSelectedProductId(product.id);
  }, []);

  const onLogProduct = useCallback(() => {
    const product = selectedProductId
      ? products.find((p) => p.id === selectedProductId)
      : null;
    if (!product || (qty === 0 && boQty === 0)) return;
    setLoggedItems((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        price: product.price,
        qty,
        boQty,
      },
    ]);
    setQty(0);
    setBoQty(0);
  }, [selectedProductId, products, qty, boQty]);

  const onRemoveItem = useCallback((index: number) => {
    setLoggedItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    selectedProduct,
    qty,
    setQty,
    boQty,
    setBoQty,
    loggedItems,
    onSelectProduct,
    onLogProduct,
    onRemoveItem,
  };
}
