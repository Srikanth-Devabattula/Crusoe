"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/Button";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type EmailValues = z.infer<typeof emailSchema>;
type OtpValues = z.infer<typeof otpSchema>;

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
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10";

export function AdminLoginForm() {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSendOtp = async (data: EmailValues) => {
    try {
      await sendOtp(data.email);
      setEmail(data.email);
      setStep("otp");
      otpForm.reset({ otp: "" });
      toast.success("Verification code sent");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onVerifyOtp = async (data: OtpValues) => {
    try {
      await verifyOtp({ email, otp: data.otp });
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onResendOtp = async () => {
    try {
      await sendOtp(email);
      toast.success("New code sent");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (step === "otp") {
    return (
      <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm text-emerald-900">
            Code sent to <span className="font-semibold">{email}</span>. Expires in 5
            minutes.
          </p>
        </div>

        <Field label="Verification code" error={otpForm.formState.errors.otp?.message}>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            className={`${inputClass} text-center text-lg tracking-[0.4em]`}
            {...otpForm.register("otp")}
          />
        </Field>

        <Button
          type="submit"
          className="w-full py-3"
          disabled={otpForm.formState.isSubmitting}
        >
          {otpForm.formState.isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify & sign in"
          )}
        </Button>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1 text-slate-600 hover:text-slate-900"
            onClick={onResendOtp}
            disabled={otpForm.formState.isSubmitting}
          >
            Resend code
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1 text-slate-600 hover:text-slate-900"
            onClick={() => {
              setStep("email");
              otpForm.reset({ otp: "" });
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Use a different email
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
        <p className="text-sm text-slate-600">
          Authorized admins only. Enter your email to receive a secure one-time code.
        </p>
      </div>

      <Field label="Work email" error={emailForm.formState.errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className={inputClass}
          {...emailForm.register("email")}
        />
      </Field>

      <Button
        type="submit"
        className="w-full py-3"
        disabled={emailForm.formState.isSubmitting}
      >
        {emailForm.formState.isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending code...
          </span>
        ) : (
          "Send verification code"
        )}
      </Button>
    </form>
  );
}
