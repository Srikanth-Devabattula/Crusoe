import { AdminHeader } from "@/components/admin/AdminHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Dashboard",
  "Admin dashboard overview."
);

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {["Blogs", "Jobs", "Applications"].map((item) => (
          <Section key={item} title={item}>
            <p className="text-sm text-gray-600">{item} stats placeholder.</p>
          </Section>
        ))}
      </div>
    </>
  );
}
