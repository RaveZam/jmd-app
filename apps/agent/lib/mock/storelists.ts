export type StoreListItem = {
  id: string;
  name: string;
  area: string;
  addressLine: string;
  contactName?: string;
  contactPhone?: string;
  /** True if tendered/visited today — shows dark green indicator. */
  visitedToday: boolean;
};

export const mockStoreLists: StoreListItem[] = [
  {
    id: "sto_001",
    name: "Poblacion",
    area: "Makati",
    addressLine: "Poblacion, Makati City",
    contactName: "Aira",
    contactPhone: "0917 000 0001",
    visitedToday: true,
  },
  {
    id: "sto_002",
    name: "Guadalupe",
    area: "Makati",
    addressLine: "Guadalupe Nuevo, Makati City",
    contactName: "Rico",
    contactPhone: "0917 000 0002",
    visitedToday: true,
  },
  {
    id: "sto_003",
    name: "Kapitolyo",
    area: "Pasig",
    addressLine: "Kapitolyo, Pasig City",
    contactName: "Mia",
    contactPhone: "0917 000 0003",
    visitedToday: false,
  },
  {
    id: "sto_004",
    name: "PureGold",
    area: "Taguig",
    addressLine: "Bonifacio Global City, Taguig",
    contactName: "Ken",
    contactPhone: "0917 000 0004",
    visitedToday: false,
  },
  {
    id: "sto_005",
    name: "Primark",
    area: "Quezon City",
    addressLine: "Cubao, Quezon City",
    contactName: "Jessa",
    contactPhone: "0917 000 0005",
    visitedToday: false,
  },
];
