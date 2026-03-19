import { LoggedItem } from "../hooks/useDistributionLog";

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type PickerModalProps = {
  visible: boolean;
  products: Product[];
  showPrice: boolean;
  onSelect: (product: Product) => void;
  onClose: () => void;
};

export type AdderPanelProps = {
  products: Product[];
  showPrice: boolean;
  onAdd: (productId: string, qty: number, boQty: number, boReason?: string) => void;
};

export type SoldRowProps = {
  item: LoggedItem;
  index: number;
  onUpdateQty: (i: number, d: number) => void;
  onDelete: (i: number) => void;
};

export type BadRowProps = {
  item: LoggedItem;
  index: number;
  onDelete: (i: number) => void;
};
export type SectionRowProps = {
  label: string;
  buttonLabel: string;
  onToggle: () => void;
};
