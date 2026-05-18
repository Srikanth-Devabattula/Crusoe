"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.admin.login);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">Checking session...</p>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
