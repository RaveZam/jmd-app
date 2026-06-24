import { updateStore } from "../services/storesLocalService";

export async function useUpdateStore(
  id: string,
  name: string,
  province: string,
  city: string,
  barangay: string,
  contactName: string,
  contactPhone: string,
) {
  await updateStore(id, {
    name,
    province,
    city,
    barangay,
    contactName,
    contactPhone,
  });
}
