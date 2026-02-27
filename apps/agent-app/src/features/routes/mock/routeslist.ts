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
    totalStores: 2,
  },
  {
    id: "route_quirino_maddela",
    name: "Quirino – Maddela",
    provinceIds: [],
    totalStores: 0,
  },
  {
    id: "route_aurora",
    name: "Aurora Province",
    provinceIds: [],
    totalStores: 0,
  },
];

