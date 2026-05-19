import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Dashboard",
  "Admin dashboard overview."
);

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
