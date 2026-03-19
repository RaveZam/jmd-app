import OutboxDao from "@/lib/sqlite/dao/outbox-dao";
import StoresDao from "@/lib/sqlite/dao/store-dao";
import { supabase } from "@/lib/supabase";

export async function useUpdateStore(
  id: string,
  name: string,
  province: string,
  city: string,
  barangay: string,
  contactName: string,
  contactPhone: string,
) {
  StoresDao.updateStore(id, {
    name: name.trim(),
    province: province.trim(),
    city: city.trim(),
    barangay: barangay.trim(),
    contactName: contactName.trim(),
    contactPhone: contactPhone.trim(),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  OutboxDao.insertOutbox(
    "STORE_UPDATED",
    JSON.stringify({
      id,
      store_name: name.trim(),
      province: province.trim(),
      city: city.trim(),
      barangay: barangay.trim(),
      contact_number: contactPhone.trim(),
      contact_name: contactName.trim(),
      tendered_by: session?.user?.id,
    }),
    1,
  );
}
