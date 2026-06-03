"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants";

function LoginPageContent() {
  const { isAuthenticated, isLoading, statusMessage, clearStatusMessage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.admin.dashboard);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => () => clearStatusMessage(), [clearStatusMessage]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in with a one-time code sent to your admin email, or create the first admin
          account.
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
