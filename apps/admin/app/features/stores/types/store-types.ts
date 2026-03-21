export type StoreItem = { productName: string; sold: number };

export type StoreRow = {
  id: string;
  storeName: string;
  contactNumber: string | null;
  contactName: string | null;
  province: string | null;
  city: string | null;
  barangay: string | null;
  createdAt: string;
  totalSales: number;
  totalBO: number;
  totalRevenue: number;
  visitCount: number;
  topItems: StoreItem[];
};
