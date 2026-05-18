"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminAuthGuard } from "./AdminAuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";

export function ConditionalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-white lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-6 sm:p-8">
          <AdminAuthGuard>{children}</AdminAuthGuard>
        </main>
      </div>
    </AuthProvider>
  );
}
