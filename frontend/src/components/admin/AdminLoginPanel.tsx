"use client";

import { useState } from "react";
import { AdminForgotPasswordForm } from "@/components/admin/AdminForgotPasswordForm";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export function AdminLoginPanel() {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [loginKey, setLoginKey] = useState(0);

  if (mode === "forgot") {
    return (
      <AdminForgotPasswordForm
        onBackToLogin={() => setMode("login")}
        onPasswordReset={() => setLoginKey((k) => k + 1)}
      />
    );
  }

  return (
    <>
      <AdminLoginForm key={loginKey} onForgotPassword={() => setMode("forgot")} />
    </>
  );
}
