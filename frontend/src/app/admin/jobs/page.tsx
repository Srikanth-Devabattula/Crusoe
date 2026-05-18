import { AdminHeader } from "@/components/admin/AdminHeader";
import { Section } from "@/components/common/Section";
import { createPageMetadata } from "@/lib/createPageMetadata";

export const metadata = createPageMetadata(
  "Manage Jobs",
  "Create and manage job listings."
);

export default function AdminJobsPage() {
  return (
    <>
      <AdminHeader title="Manage Jobs" />
      <Section title="Job Listings">
        <p className="text-sm text-gray-600">Job management table placeholder.</p>
      </Section>
    </>
  );
}
