import { ProductRow } from "../components/ProductsTable";

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
