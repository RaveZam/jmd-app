import { useState } from "react";
import { mockProducts } from "@/lib/mock/products";

export function useProducts() {
  const [selectedProductId, setSelectedProductId] = useState(
    mockProducts[0]?.id ?? "",
  );
  return { mockProducts, selectedProductId, setSelectedProductId };
}

