import { AdminNewsContent } from "@/components/admin/AdminNewsContent";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Manage News",
  "Create and manage company news articles."
);

export default function AdminNewsPage() {
  return <AdminNewsContent />;
}
