import { addStore } from "../services/storesLocalService";

export async function useAddStore(
  provinceId: string,
  name: string,
  province: string,
  city: string,
  barangay: string,
  contactName: string,
  contactPhone: string,
) {
  await addStore(provinceId, {
    name,
    province,
    city,
    barangay,
    contactName,
    contactPhone,
  });
}
