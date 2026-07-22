"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import { authService } from "@/services";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const resetSchema = z
  .object({
    otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailValues = z.infer<typeof emailSchema>;
type ResetValues = z.infer<typeof resetSchema>;

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

interface AdminForgotPasswordFormProps {
  onBackToLogin: () => void;
  onPasswordReset?: () => void;
}

export function AdminForgotPasswordForm({
  onBackToLogin,
  onPasswordReset,
}: AdminForgotPasswordFormProps) {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const sendOtp = async (values: EmailValues) => {
    setIsSendingOtp(true);
    try {
      await authService.requestAdminPasswordOtp({ email: values.email.trim() });
      setEmail(values.email.trim().toLowerCase());
      setStep("reset");
      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onReset = async (values: ResetValues) => {
    try {
      await authService.resetAdminPassword({
        email,
        otp: values.otp,
        password: values.password,
      });
      toast.success("Password updated. You can sign in now.");
      onPasswordReset?.();
      onBackToLogin();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const resendOtp = async () => {
    if (!email) return;
    setIsSendingOtp(true);
    try {
      await authService.requestAdminPasswordOtp({ email });
      toast.success("New code sent");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSendingOtp(false);
    }
  };

  if (step === "email") {
    return (
      <div>
        <p className="mb-6 text-sm text-gray-600">
          Enter the administrator email configured on the server. We will send a verification code
          to reset your password.
        </p>
        <form onSubmit={emailForm.handleSubmit(sendOtp)} className="space-y-5">
          <Field label="Administrator email" error={emailForm.formState.errors.email?.message}>
            <input
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              className={inputClass}
              {...emailForm.register("email")}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={isSendingOtp}>
            {isSendingOtp ? "Sending..." : "Send verification code"}
          </Button>
        </form>
        <button
          type="button"
          onClick={onBackToLogin}
          className="mt-6 w-full text-center text-sm font-medium text-brand hover:underline"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-600">
        Code sent to <span className="font-medium text-gray-900">{email}</span>
      </p>
      <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-5">
        <Field label="Verification code" error={resetForm.formState.errors.otp?.message}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            className={inputClass}
            {...resetForm.register("otp")}
          />
        </Field>
        <Field label="New password" error={resetForm.formState.errors.password?.message}>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Min 6 characters"
            className={inputClass}
            {...resetForm.register("password")}
          />
        </Field>
        <Field label="Confirm password" error={resetForm.formState.errors.confirmPassword?.message}>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
            className={inputClass}
            {...resetForm.register("confirmPassword")}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={resetForm.formState.isSubmitting}>
          {resetForm.formState.isSubmitting ? "Saving..." : "Set new password"}
        </Button>
      </form>
      <div className="mt-4 flex flex-col gap-2 text-center text-sm">
        <button
          type="button"
          onClick={resendOtp}
          disabled={isSendingOtp}
          className="font-medium text-brand hover:underline disabled:opacity-50"
        >
          Resend code
        </button>
        <button type="button" onClick={() => setStep("email")} className="text-gray-600 hover:underline">
          Change email
        </button>
        <button type="button" onClick={onBackToLogin} className="text-gray-600 hover:underline">
          Back to login
        </button>
      </div>
    </div>
  );
}
