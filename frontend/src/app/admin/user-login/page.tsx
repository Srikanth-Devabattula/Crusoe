"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginShell } from "@/components/admin/AdminLoginShell";
import { StaffLoginForm } from "@/components/admin/StaffLoginForm";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants";
import { getDefaultAdminPath } from "@/lib/admin-permissions";

function StaffLoginPageContent() {
  const { user, isAuthenticated, isLoading, statusMessage, clearStatusMessage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(getDefaultAdminPath(user));
    }
  }, [isAuthenticated, isLoading, router, user]);

  useEffect(() => () => clearStatusMessage(), [clearStatusMessage]);

  return (
    <AdminLoginShell
      title="Staff login"
      description="Sign in with the email and password created for you in Admin → Users."
      alternateHref={ROUTES.admin.login}
      alternateLabel="Administrator?"
      statusMessage={statusMessage}
    >
      <StaffLoginForm />
    </AdminLoginShell>
  );
}

export default function StaffLoginPage() {
  return (
    <AuthProvider>
      <StaffLoginPageContent />
    </AuthProvider>
  );
}
