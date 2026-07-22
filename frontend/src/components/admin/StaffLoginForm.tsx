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
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

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
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-800">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function StaffLoginForm() {
  const { staffLogin, isLoading } = useAuth();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      await staffLogin(data);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Email" error={form.formState.errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@crusoetec.com"
          className={inputClass}
          {...form.register("email")}
        />
      </Field>
      <Field label="Password" error={form.formState.errors.password?.message}>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className={inputClass}
          {...form.register("password")}
        />
      </Field>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in..." : "Log in"}
      </Button>
    </form>
  );
}
