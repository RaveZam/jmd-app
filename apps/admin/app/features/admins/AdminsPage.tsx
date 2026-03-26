import type { ReactElement } from "react";
import { getAdmins } from "./services/adminsService";
import { AdminsClient } from "./components/AdminsClient";

async function AdminsPage(): Promise<ReactElement> {
  const admins = await getAdmins();
  return <AdminsClient admins={admins} />;
}

export { AdminsPage };
export default AdminsPage;
