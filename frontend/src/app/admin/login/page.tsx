"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgb(56 189 248 / 0.35), transparent)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Shield className="h-7 w-7 text-sky-300" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Admin access</h1>
          <p className="mt-2 text-sm text-slate-400">
            Secure sign-in with email verification
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/40">
          {statusMessage && (
            <p className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {statusMessage}
            </p>
          )}
          <AdminLoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          OTP expires in 5 minutes. Only authorized emails can sign in.
        </p>
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
