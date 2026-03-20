export type SessionRow = {
  id: string;
  routeName: string;
  sessionDate: string;
  conductedBy: string;
  conductedByName: string;
  status: "ongoing" | "completed";
  createdAt: string;
  totalStores: number;
  visitedStores: number;
};

export type SessionStoreRow = {
  id: string;
  storeId: string;
  storeName: string;
  province: string | null;
  city: string | null;
  barangay: string | null;
  visited: boolean;
};
