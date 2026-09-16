"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  ApplicationMessageField,
  applicationInputClass,
  APPLICATION_PHONE_PLACEHOLDER,
} from "@/components/careers/ApplicationMessageField";
import { ROUTES } from "@/constants";
import { getApiErrorMessage } from "@/lib/api-error";
import { validateApplicationMessage } from "@/lib/wordCount";
import { applicationService } from "@/services";

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export function JobApplicationForm({ jobId, jobTitle }: JobApplicationFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const messageError = validateApplicationMessage(message);
    if (messageError) {
      toast.error(messageError);
      return;
    }

    if (!resume) {
      toast.error("Please attach your resume (PDF or Word).");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    if (phone.trim()) formData.append("phone", phone.trim());
    formData.append("message", message.trim());
    formData.append("resume", resume);

    setIsSubmitting(true);
    try {
      await applicationService.submit(formData);
      toast.success("Application submitted!");
      router.push(`${ROUTES.thankYou}?type=application`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-[#E8EEF5] bg-[#f8faf6] p-6 sm:p-8"
    >
      <h2 className="text-xl font-bold text-slate-900">Apply for this role</h2>
      <p className="mt-2 text-sm text-slate-600">
        Submit your details for <span className="font-medium">{jobTitle}</span>.
        Accepted formats: PDF, DOC, DOCX (max 5MB).
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="apply-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="apply-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={applicationInputClass}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="apply-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="apply-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={applicationInputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="apply-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            id="apply-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={applicationInputClass}
            placeholder={APPLICATION_PHONE_PLACEHOLDER}
          />
        </div>

        <ApplicationMessageField
          id="apply-message"
          value={message}
          onChange={setMessage}
        />

        <div>
          <label htmlFor="apply-resume" className="mb-1.5 block text-sm font-medium text-slate-700">
            Resume <span className="text-red-500">*</span>
          </label>
          <input
            id="apply-resume"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setResume(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-2xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(126,168,73,0.35)] transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
      >
        {isSubmitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
