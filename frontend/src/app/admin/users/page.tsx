import { AdminUsersContent } from "@/components/admin/AdminUsersContent";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata("Users", "Manage admin team users and permissions.");

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
