import { getDb } from "@/src/lib/db";
import { enqueueOutbox } from "@/src/lib/sync/outbox";
import StoresDao from "@/src/lib/dao/store-dao";
import { supabase } from "@/src/lib/supabase";

type StoreFields = {
  name: string;
  province: string;
  city: string;
  barangay: string;
  contactName: string;
  contactPhone: string;
};

function remotePayload(id: string, f: StoreFields, tenderedBy?: string) {
  return {
    id,
    store_name: f.name,
    province: f.province,
    city: f.city,
    barangay: f.barangay,
    contact_number: f.contactPhone,
    contact_name: f.contactName,
    tendered_by: tenderedBy,
  };
}

export async function addStore(
  provinceId: string,
  fields: StoreFields,
): Promise<void> {
  const f: StoreFields = trimFields(fields);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  getDb().withTransactionSync(() => {
    const id = StoresDao.insertStore({ provinceId, ...toDaoInput(f) });
    enqueueOutbox({
      entityType: "store",
      entityId: id,
      operation: "create",
      payload: remotePayload(id, f, session?.user?.id),
    });
  });
}

export async function updateStore(
  id: string,
  fields: StoreFields,
): Promise<void> {
  const f: StoreFields = trimFields(fields);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  getDb().withTransactionSync(() => {
    StoresDao.updateStore(id, toDaoInput(f));
    enqueueOutbox({
      entityType: "store",
      entityId: id,
      // upsert the full row: an offline-created store may not exist remotely yet
      operation: "create",
      payload: remotePayload(id, f, session?.user?.id),
    });
  });
}

function trimFields(f: StoreFields): StoreFields {
  return {
    name: f.name.trim(),
    province: f.province.trim(),
    city: f.city.trim(),
    barangay: f.barangay.trim(),
    contactName: f.contactName.trim(),
    contactPhone: f.contactPhone.trim(),
  };
}

function toDaoInput(f: StoreFields) {
  return {
    name: f.name,
    province: f.province,
    city: f.city,
    barangay: f.barangay,
    contactName: f.contactName,
    contactPhone: f.contactPhone,
  };
}
