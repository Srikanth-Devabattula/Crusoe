import { AdminBlogsContent } from "@/components/admin/AdminBlogsContent";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Manage Blogs",
  "Create and manage blog posts."
);

export default function AdminBlogsPage() {
  return <AdminBlogsContent />;
}
