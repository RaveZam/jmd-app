import { db } from "@/lib/sqlite/db-migration";
import { v4 as uuidv4 } from "uuid";

type InsertStoreInput = {
  provinceId: string;
  name: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
};

const StoresDao = {
  insertStore(input: InsertStoreInput) {
    const id = uuidv4();
    db.runSync(
      `INSERT INTO stores
       (id, province_id, name, address, contact_number, contact_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.provinceId,
        input.name,
        input.address ?? "",
        input.contactPhone ?? "",
        input.contactName ?? "",
      ],
    );
    return id;
  },
};
export default StoresDao;
