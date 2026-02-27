export type Route = {
  id: string;
  name: string;
  provinceIds: string[];
  totalStores: number;
};

export const ROUTES: Route[] = [
  {
    id: "route_cauayan",
    name: "Cauayan City",
    provinceIds: ["province_pasig", "province_makati"],
    totalStores: 8,
  },
  {
    id: "route_quirino_maddela",
    name: "Quirino – Maddela",
    provinceIds: ["province_quirino", "province_maddela"],
    totalStores: 4,
  },
  {
    id: "route_aurora",
    name: "Aurora Province",
    provinceIds: ["province_baler", "province_dipaculao"],
    totalStores: 4,
  },
];

