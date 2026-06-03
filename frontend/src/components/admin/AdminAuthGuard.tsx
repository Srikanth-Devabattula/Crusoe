"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants";
import { canAccessPath, getDefaultAdminPath } from "@/lib/admin-permissions";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.admin.login);
      return;
    }

    if (!isLoading && user && pathname.startsWith("/admin") && !canAccessPath(user, pathname)) {
      router.replace(getDefaultAdminPath(user));
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">Checking session...</p>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user && pathname.startsWith("/admin") && !canAccessPath(user, pathname)) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">Redirecting...</p>
    );
  }

  return <>{children}</>;
}
