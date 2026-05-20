"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}

export function AdminLoginForm() {
  const { login, isLoading } = useAuth();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = async (data: LoginValues) => {
    try {
      await login(data);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
      <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
        Log in with your admin email and password.
      </p>
      <Field label="Email" error={loginForm.formState.errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          {...loginForm.register("email")}
        />
      </Field>
      <Field label="Password" error={loginForm.formState.errors.password?.message}>
        <input
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          {...loginForm.register("password")}
        />
      </Field>
      <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
        {loginForm.formState.isSubmitting ? "Signing in..." : "Log in"}
      </Button>
    </form>
  );
}
