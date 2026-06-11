"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { getDefaultAdminPath } from "@/lib/admin-permissions";

function LoginPageContent() {
  const { user, isAuthenticated, isLoading, statusMessage, clearStatusMessage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(getDefaultAdminPath(user));
    }
  }, [isAuthenticated, isLoading, router, user]);

  useEffect(() => () => clearStatusMessage(), [clearStatusMessage]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
        <p className="mt-2 text-sm text-gray-600">
          Admins sign in with a one-time email code. Team members use email and password.
        </p>
        {statusMessage && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
            {statusMessage}
          </p>
        )}
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <LoginPageContent />
    </AuthProvider>
  );
}
