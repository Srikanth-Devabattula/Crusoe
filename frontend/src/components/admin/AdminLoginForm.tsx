"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/Button";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
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
    <>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}

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
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onVerifyOtp = async (data: OtpValues) => {
    try {
      await verifyOtp({ email, otp: data.otp });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const onResendOtp = async () => {
    try {
      await sendOtp(email);
      toast.success("OTP resent to your email");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (step === "otp") {
    return (
      <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
        <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>
        <Field label="OTP" error={otpForm.formState.errors.otp?.message}>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm tracking-widest"
            {...otpForm.register("otp")}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={otpForm.formState.isSubmitting}>
          {otpForm.formState.isSubmitting ? "Verifying..." : "Verify & log in"}
        </Button>
        <div className="flex flex-col gap-2 text-sm">
          <button
            type="button"
            className="text-gray-600 underline"
            onClick={onResendOtp}
            disabled={otpForm.formState.isSubmitting}
          >
            Resend OTP
          </button>
          <button
            type="button"
            className="text-gray-600 underline"
            onClick={() => {
              setStep("email");
              otpForm.reset({ otp: "" });
            }}
          >
            Use a different email
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
      <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">
        Enter your authorized admin email. We will send a one-time code to sign in.
      </p>
      <Field label="Email" error={emailForm.formState.errors.email?.message}>
        <input
          type="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          {...emailForm.register("email")}
        />
      </Field>
      <Button type="submit" className="w-full" disabled={emailForm.formState.isSubmitting}>
        {emailForm.formState.isSubmitting ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  );
}
