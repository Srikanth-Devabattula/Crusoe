import { AdminContactsContent } from "@/components/admin/AdminContactsContent";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Contact Enquiries",
  "Review messages submitted from the contact page."
);

export default function AdminContactsPage() {
  return <AdminContactsContent />;
}
