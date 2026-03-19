export type ProvinceRow = { id: string; name: string; route_id: string };

export type StoreRow = {
  id: string;
  name: string;
  province_id: string;
  province: string;
  city: string;
  barangay: string;
  contact_number: string;
  contact_name: string;
};
