export type Province = {
  id: string;
  name: string;
  routeId: string;
  storeIds: string[];
};

export const PROVINCES: Province[] = [
  {
    id: "province_pasig",
    name: "Pasig",
    routeId: "route_cauayan",
    storeIds: ["store_kapitolyo"],
  },
  {
    id: "province_makati",
    name: "Makati",
    routeId: "route_cauayan",
    storeIds: ["store_guadalupe"],
  },
];

