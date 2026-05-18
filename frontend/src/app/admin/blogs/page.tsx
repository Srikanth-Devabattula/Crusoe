import { AdminHeader } from "@/components/admin/AdminHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Manage Blogs",
  "Create and manage blog posts."
);

export default function AdminBlogsPage() {
  return (
    <>
      <AdminHeader title="Manage Blogs" />
      <Section title="Blog Posts">
        <p className="text-sm text-gray-600">Blog management table placeholder.</p>
      </Section>
    </>
  );
}
