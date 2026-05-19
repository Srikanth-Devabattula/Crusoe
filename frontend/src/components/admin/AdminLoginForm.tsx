"use client";

import { useEffect, useState } from "react";
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

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

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
  const { hasAdmin, login, register, checkHasAdmin, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  const isRegister = hasAdmin === false;

  useEffect(() => {
    if (hasAdmin === false) setMode("register");
    else if (hasAdmin === true) setMode("login");
  }, [hasAdmin]);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onLogin = async (data: LoginValues) => {
    try {
      await login(data);
      toast.success("User logged in successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onRegister = async (data: RegisterValues) => {
    try {
      await register(data);
      toast.success("User created successfully");
      await checkHasAdmin();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading && hasAdmin === null) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  if (isRegister || mode === "register") {
    return (
      <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
        <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">
          No admin account yet. Create your first admin user below.
        </p>
        <Field label="Name" error={registerForm.formState.errors.name?.message}>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            {...registerForm.register("name")}
          />
        </Field>
        <Field label="Email" error={registerForm.formState.errors.email?.message}>
          <input
            type="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            {...registerForm.register("email")}
          />
        </Field>
        <Field label="Password" error={registerForm.formState.errors.password?.message}>
          <input
            type="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            {...registerForm.register("password")}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
          {registerForm.formState.isSubmitting ? "Creating..." : "Create admin account"}
        </Button>
        {hasAdmin && (
          <button
            type="button"
            className="w-full text-sm text-gray-600 underline"
            onClick={() => setMode("login")}
          >
            Already have an account? Log in
          </button>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
      <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
        Admin account exists. Log in with your email and password.
      </p>
      <Field label="Email" error={loginForm.formState.errors.email?.message}>
        <input
          type="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          {...loginForm.register("email")}
        />
      </Field>
      <Field label="Password" error={loginForm.formState.errors.password?.message}>
        <input
          type="password"
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
