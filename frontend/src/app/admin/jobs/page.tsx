import { AdminJobsContent } from "@/components/admin/AdminJobsContent";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Manage Jobs",
  "Create and manage job listings."
);

export default function AdminJobsPage() {
  return <AdminJobsContent />;
}
