import { db } from "@/lib/sqlite/db-migration";
import { v4 as uuidv4 } from "uuid";
import { logTable } from "@/lib/sqlite/log-table";

type InsertStoreInput = {
  provinceId: string;
  name: string;
  province?: string;
  city?: string;
  barangay?: string;
  contactName?: string;
  contactPhone?: string;
};

const StoresDao = {
  getStoresForRoute(routeId: string) {
    return db.getAllSync<{
      id: string;
      name: string;
      province_id: string;
      province: string;
      city: string;
      barangay: string;
      contact_number: string;
      contact_name: string;
    }>(
      `SELECT s.* FROM stores s
       INNER JOIN provinces p ON s.province_id = p.id
       WHERE p.route_id = ?`,
      [routeId],
    );
  },

  getStoresForProvince(provinceId: string) {
    return db.getAllSync<{
      id: string;
      name: string;
      province_id: string;
      province: string;
      city: string;
      barangay: string;
      contact_number: string;
      contact_name: string;
    }>(`SELECT * FROM stores WHERE province_id = ?`, [provinceId]);
  },

  deleteStore(id: string) {
    db.runSync(`DELETE FROM stores WHERE id = ?`, [id]);
  },

  updateStore(id: string, input: Omit<InsertStoreInput, "provinceId">) {
    db.runSync(
      `UPDATE stores SET name = ?, province = ?, city = ?, barangay = ?, contact_number = ?, contact_name = ? WHERE id = ?`,
      [
        input.name,
        input.province ?? "",
        input.city ?? "",
        input.barangay ?? "",
        input.contactPhone ?? "",
        input.contactName ?? "",
        id,
      ],
    );
  },

  logAll() {
    const rows = db.getAllSync<{
      id: string;
      name: string;
      province_id: string;
      province: string;
      city: string;
      barangay: string;
      contact_number: string;
      contact_name: string;
    }>(`SELECT * FROM stores`);
    logTable("stores", rows as Record<string, unknown>[]);
  },

  insertStore(input: InsertStoreInput) {
    const id = uuidv4();
    db.runSync(
      `INSERT INTO stores
       (id, province_id, name, province, city, barangay, contact_number, contact_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.provinceId,
        input.name,
        input.province ?? "",
        input.city ?? "",
        input.barangay ?? "",
        input.contactPhone ?? "",
        input.contactName ?? "",
      ],
    );
    return id;
  },
};
export default StoresDao;
