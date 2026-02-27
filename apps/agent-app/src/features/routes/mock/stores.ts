export type Store = {
  id: string;
  name: string;
  provinceId: string;
  address: string;
  contactName: string;
  contactNumber: string;
};

export const STORES: Store[] = [
  {
    id: "store_kapitolyo",
    name: "Kapitolyo",
    provinceId: "province_pasig",
    address: "Kapitolyo, Pasig City",
    contactName: "Mia",
    contactNumber: "0917 000 0003",
  },
  {
    id: "store_guadalupe",
    name: "Guadalupe",
    provinceId: "province_makati",
    address: "Guadalupe Nuevo, Makati City",
    contactName: "Rico",
    contactNumber: "0917 000 0002",
  },
];
