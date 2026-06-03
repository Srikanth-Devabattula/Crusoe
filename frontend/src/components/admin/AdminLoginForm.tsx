"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/Button";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

type EmailValues = z.infer<typeof emailSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type OtpValues = z.infer<typeof otpSchema>;

const RESEND_COOLDOWN_SEC = 60;

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
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AdminLoginForm() {
  const { hasAdmin, requestOtp, verifyOtp, resendOtp, register, checkHasAdmin, isLoading } =
    useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isRegister = hasAdmin === false;

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const tickCountdown = useCallback(() => {
    setOtpExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  useEffect(() => {
    if (otpExpiresIn <= 0 && resendCooldown <= 0) return;
    const id = window.setInterval(tickCountdown, 1000);
    return () => window.clearInterval(id);
  }, [otpExpiresIn, resendCooldown, tickCountdown]);

  const onRequestOtp = async (data: EmailValues) => {
    try {
      const result = await requestOtp({ email: data.email });
      setPendingEmail(data.email.trim().toLowerCase());
      setOtpExpiresIn(result.expiresIn);
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setStep("otp");
      otpForm.reset({ otp: "" });
      toast.success(result.message || "Verification code sent to your email");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onVerifyOtp = async (data: OtpValues) => {
    try {
      await verifyOtp({ email: pendingEmail, otp: data.otp });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onResendOtp = async () => {
    if (resendCooldown > 0 || !pendingEmail) return;
    try {
      const result = await resendOtp({ email: pendingEmail });
      setOtpExpiresIn(result.expiresIn);
      setResendCooldown(RESEND_COOLDOWN_SEC);
      otpForm.reset({ otp: "" });
      toast.success(result.message || "New verification code sent");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onRegister = async (data: RegisterValues) => {
    try {
      await register(data);
      toast.success("Admin account created");
      await checkHasAdmin();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const backToEmail = () => {
    setStep("email");
    setPendingEmail("");
    setOtpExpiresIn(0);
    setResendCooldown(0);
    otpForm.reset({ otp: "" });
  };

  if (isLoading && hasAdmin === null) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  if (isRegister) {
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
      </form>
    );
  }

  if (step === "otp") {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={backToEmail}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Change email
        </button>

        <div className="rounded-md bg-gray-50 px-3 py-3">
          <p className="text-sm text-gray-600">We sent a 6-digit code to</p>
          <p className="mt-0.5 flex items-center gap-2 text-sm font-medium text-gray-900">
            <Mail className="h-4 w-4 shrink-0 text-gray-500" />
            {pendingEmail}
          </p>
          {otpExpiresIn > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              Code expires in {formatTime(otpExpiresIn)}
            </p>
          )}
          {otpExpiresIn === 0 && (
            <p className="mt-2 text-xs text-amber-700">
              Code may have expired. Request a new one below.
            </p>
          )}
        </div>

        <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
          <Field label="Verification code" error={otpForm.formState.errors.otp?.message}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              className="w-full rounded-md border border-gray-300 px-3 py-3 text-center font-mono text-2xl tracking-[0.4em] text-gray-900"
              {...otpForm.register("otp", {
                onChange: (e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                  e.target.value = digits;
                  otpForm.setValue("otp", digits, { shouldValidate: true });
                },
              })}
            />
          </Field>

          <Button type="submit" className="w-full" disabled={otpForm.formState.isSubmitting}>
            {otpForm.formState.isSubmitting ? "Verifying..." : "Verify & sign in"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            disabled={resendCooldown > 0}
            onClick={onResendOtp}
            className="text-sm text-gray-600 underline transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
          >
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Resend verification code"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={emailForm.handleSubmit(onRequestOtp)} className="space-y-4">
      <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
        Enter your admin email. We&apos;ll send a one-time verification code to sign in.
      </p>
      <Field label="Email" error={emailForm.formState.errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          placeholder="admin@company.com"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          {...emailForm.register("email")}
        />
      </Field>
      <Button type="submit" className="w-full" disabled={emailForm.formState.isSubmitting}>
        {emailForm.formState.isSubmitting ? "Sending code..." : "Send verification code"}
      </Button>
    </form>
  );
}
