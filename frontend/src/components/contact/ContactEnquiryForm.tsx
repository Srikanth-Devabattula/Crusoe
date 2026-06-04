"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiBriefcase,
  FiEdit3,
  FiLock,
  FiMail,
  FiPhone,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { z } from "zod";

import { ROUTES } from "@/constants";
import { SERVICE_OPTIONS } from "@/data/contactPage";
import { contactService } from "@/services/contact.service";
import { fadeUp, viewportOnce } from "@/lib/motion";

import { ContactInput, ContactSelect, ContactTextarea } from "./ContactInput";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(8, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the terms to continue",
  }),
});

type FormValues = z.infer<typeof schema>;

export function ContactEnquiryForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      service: "",
      subject: "",
      message: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const name = values.companyName
        ? `${values.fullName} (${values.companyName})`
        : values.fullName;

      await contactService.submit({
        name,
        email: values.email,
        phone: values.phone,
        company: values.companyName,
        service: values.service,
        subject: values.subject,
        message: values.message,
      });

      toast.success("Enquiry sent successfully!");
      router.push(ROUTES.thankYou);
    } catch {
      toast.error("Could not send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      custom={0}
      className="rounded-[32px] border border-[#e7efe0] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10"
    >
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <FiSend className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-heading text-xl sm:text-2xl">Send Us a Message</h2>
          <p className="text-description mt-2 text-sm sm:text-base">
            Fill in the details below and our team will get back to you shortly.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <ContactInput
            icon={<FiUser className="h-[18px] w-[18px]" />}
            placeholder="Full Name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <ContactInput
            icon={<FiBriefcase className="h-[18px] w-[18px]" />}
            placeholder="Company Name"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <ContactInput
            type="email"
            icon={<FiMail className="h-[18px] w-[18px]" />}
            placeholder="Email Address"
            error={errors.email?.message}
            {...register("email")}
          />
          <ContactInput
            type="tel"
            icon={<FiPhone className="h-[18px] w-[18px]" />}
            placeholder="Phone Number"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <ContactSelect
          icon={<FiBriefcase className="h-[18px] w-[18px]" />}
          options={SERVICE_OPTIONS}
          error={errors.service?.message}
          placeholder="Service Interested In"
          {...register("service")}
        />

        <ContactInput
          icon={<FiEdit3 className="h-[18px] w-[18px]" />}
          placeholder="Subject"
          error={errors.subject?.message}
          {...register("subject")}
        />

        <ContactTextarea
          icon={<FiEdit3 className="h-[18px] w-[18px]" />}
          placeholder="Your message..."
          rows={5}
          error={errors.message?.message}
          {...register("message")}
        />

        <label className="flex cursor-pointer items-start gap-3 text-sm text-[#6B7280]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand focus:ring-brand/30"
            {...register("agreeToTerms")}
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-medium text-brand hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-brand hover:underline">
              Terms of Service
            </a>
            .
          </span>
        </label>
        {errors.agreeToTerms ? (
          <p className="-mt-3 text-xs text-red-600">{errors.agreeToTerms.message}</p>
        ) : null}

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand to-brand-light px-6 py-4 text-base font-semibold text-white shadow-[0_14px_34px_rgba(126, 168, 73,0.32)] transition-shadow duration-300 hover:shadow-[0_20px_44px_rgba(126, 168, 73,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiSend className="h-5 w-5" aria-hidden />
          {submitting ? "Sending..." : "Send Enquiry"}
        </motion.button>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-[#6B7280]">
          <FiLock className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
          Your information is secure and will never be shared.
        </p>
      </form>
    </motion.div>
  );
}
