import { ProductRow } from "../components/ProductsTable";
import type { NewProduct } from "../components/AddProductModal";

export type ProductsTableProps = {
  products: ProductRow[];
  onEdit: (product: ProductRow) => void;
  onDelete: (id: string) => void;
};

export type AddProductModalProps = {
  onClose: () => void;
  onAdd: (product: NewProduct) => void;
  initialValues?: NewProduct;
  title?: string;
};
