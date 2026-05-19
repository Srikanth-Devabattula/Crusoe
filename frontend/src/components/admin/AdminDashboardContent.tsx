"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Section } from "@/components/common/Section";
import { useAuth } from "@/contexts/AuthContext";

export function AdminDashboardContent() {
  const { user, statusMessage } = useAuth();

  const bannerText =
    statusMessage ||
    `User logged in: ${user?.name} (${user?.email})`;

  return (
    <>
      <AdminHeader title="Dashboard" />
      <p className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        {bannerText}
      </p>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {["Blogs", "Jobs", "Applications"].map((item) => (
          <Section key={item} title={item}>
            <p className="text-sm text-gray-600">{item} stats placeholder.</p>
          </Section>
        ))}
      </section>
    </>
  );
}
