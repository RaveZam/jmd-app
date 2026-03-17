import OutboxDao from "@/lib/sqlite/dao/outbox-dao";
import StoresDao from "@/lib/sqlite/dao/store-dao";

export function useAddStore(
  provinceId: string,
  name: string,
  address: string,
  contactName: string,
  contactPhone: string,
) {
  const id = StoresDao.insertStore({
    provinceId,
    name: name.trim(),
    address: address.trim(),
    contactName: contactName.trim(),
    contactPhone: contactPhone.trim(),
  });

  OutboxDao.insertOutbox(
    "STORE_ADDED",
    JSON.stringify({
      id,
      provinceId,
      name: name.trim(),
      address: address.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
    }),
    1,
  );
}
