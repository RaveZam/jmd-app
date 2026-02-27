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
    storeIds: [
      "store_kapitolyo",
      "store_pasig_market",
      "store_cainta_junction",
      "store_tiendesitas",
    ],
  },
  {
    id: "province_makati",
    name: "Makati",
    routeId: "route_cauayan",
    storeIds: [
      "store_guadalupe",
      "store_poblacion",
      "store_legazpi_village",
      "store_salcedo",
    ],
  },
  {
    id: "province_quirino",
    name: "Quirino",
    routeId: "route_quirino_maddela",
    storeIds: ["store_quirino_centro", "store_quirino_public_market"],
  },
  {
    id: "province_maddela",
    name: "Maddela",
    routeId: "route_quirino_maddela",
    storeIds: ["store_maddela_town_center", "store_maddela_market"],
  },
  {
    id: "province_baler",
    name: "Baler",
    routeId: "route_aurora",
    storeIds: ["store_baler_bay", "store_baler_market"],
  },
  {
    id: "province_dipaculao",
    name: "Dipaculao",
    routeId: "route_aurora",
    storeIds: ["store_dipaculao_beach", "store_dipaculao_market"],
  },
];
