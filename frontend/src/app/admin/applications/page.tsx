import { AdminApplicationsContent } from "@/components/admin/AdminApplicationsContent";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Job Applications",
  "Review applications submitted for open roles."
);

export default function AdminApplicationsPage() {
  return <AdminApplicationsContent />;
}
