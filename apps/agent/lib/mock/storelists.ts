export type StoreListItem = {
  id: string;
  name: string;
  area: string;
  addressLine: string;
  contactName?: string;
  contactPhone?: string;
  lastVisitedISO?: string; // YYYY-MM-DD
};

export const mockStoreLists: StoreListItem[] = [
  {
    id: "sto_001",
    name: "JM Bakery - Poblacion",
    area: "Makati",
    addressLine: "Poblacion, Makati City",
    contactName: "Aira",
    contactPhone: "0917 000 0001",
    lastVisitedISO: "2026-02-23",
  },
  {
    id: "sto_002",
    name: "JM Bakery - Guadalupe",
    area: "Makati",
    addressLine: "Guadalupe Nuevo, Makati City",
    contactName: "Rico",
    contactPhone: "0917 000 0002",
    lastVisitedISO: "2026-02-22",
  },
  {
    id: "sto_003",
    name: "JM Bakery - Kapitolyo",
    area: "Pasig",
    addressLine: "Kapitolyo, Pasig City",
    contactName: "Mia",
    contactPhone: "0917 000 0003",
  },
  {
    id: "sto_004",
    name: "JM Bakery - BGC",
    area: "Taguig",
    addressLine: "Bonifacio Global City, Taguig",
    contactName: "Ken",
    contactPhone: "0917 000 0004",
    lastVisitedISO: "2026-02-21",
  },
  {
    id: "sto_005",
    name: "JM Bakery - Cubao",
    area: "Quezon City",
    addressLine: "Cubao, Quezon City",
    contactName: "Jessa",
    contactPhone: "0917 000 0005",
  },
];
