"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import { jobService } from "@/services";
import type { Job, JobFormData } from "@/types";

const jobSchema = z.object({
  title: z.string().min(2, "Title is required"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(500, "Short description is too long"),
  longDescription: z.string().min(30, "Long description must be at least 30 characters"),
  experience: z.string().min(1, "Experience is required"),
  location: z.string().min(2, "Location is required"),
  department: z.string().optional(),
  type: z.enum(["full-time", "part-time", "contract", "remote"]),
  published: z.boolean(),
});

type JobFormValues = z.infer<typeof jobSchema>;

const defaultValues: JobFormValues = {
  title: "",
  shortDescription: "",
  longDescription: "",
  experience: "",
  location: "",
  department: "",
  type: "full-time",
  published: false,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {hint && <p className="mb-2 text-xs text-gray-500">{hint}</p>}
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface AdminJobFormProps {
  onSuccess: () => void;
  editingJob?: Job | null;
  onCancelEdit?: () => void;
}

export function AdminJobForm({ onSuccess, editingJob, onCancelEdit }: AdminJobFormProps) {
  const isEditing = Boolean(editingJob);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingJob) {
      form.reset({
        title: editingJob.title,
        shortDescription: editingJob.shortDescription ?? "",
        longDescription:
          editingJob.longDescription ??
          (editingJob as Job & { description?: string }).description ??
          "",
        experience: editingJob.experience ?? "",
        location: editingJob.location ?? "",
        department: editingJob.department ?? "",
        type: editingJob.type ?? "full-time",
        published: editingJob.published,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editingJob, form]);

  const onSubmit = async (data: JobFormValues) => {
    const payload: JobFormData = {
      ...data,
      department: data.department?.trim() || undefined,
    };

    try {
      if (isEditing && editingJob) {
        await jobService.update(editingJob._id, payload);
        toast.success("Job updated successfully");
      } else {
        await jobService.create(payload);
        toast.success("Job posted successfully");
        form.reset(defaultValues);
      }
      onSuccess();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? "Edit job posting" : "Post a new job"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing
            ? "Update the listing below. Changes apply on the careers page when published."
            : "Fill in the details candidates will see on the careers page."}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Job title" required error={form.formState.errors.title?.message}>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Web Designer"
            {...form.register("title")}
          />
        </Field>

        <Field label="Department" error={form.formState.errors.department?.message}>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Design & Creative"
            {...form.register("department")}
          />
        </Field>

        <Field label="Experience" required error={form.formState.errors.experience?.message}>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. 3+ years"
            {...form.register("experience")}
          />
        </Field>

        <Field label="Location" required error={form.formState.errors.location?.message}>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Visakhapatnam / Hyderabad, India · Hybrid"
            {...form.register("location")}
          />
        </Field>

        <Field label="Job type" required error={form.formState.errors.type?.message}>
          <select className={inputClass} {...form.register("type")}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </Field>

        <Field label="Status">
          <label className="flex h-[42px] cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              {...form.register("published")}
            />
            <span className="text-sm text-gray-700">Publish on careers page</span>
          </label>
        </Field>
      </div>

      <div className="mt-5">
        <Field
          label="Short description"
          required
          hint="One or two sentences shown in the job card preview."
          error={form.formState.errors.shortDescription?.message}
        >
          <textarea
            rows={3}
            className={inputClass}
            placeholder="e.g. Join our team to design modern, responsive web experiences for global SaaS and engineering clients."
            {...form.register("shortDescription")}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field
          label="Long description"
          required
          hint="Full role summary — responsibilities, requirements, and what you offer."
          error={form.formState.errors.longDescription?.message}
        >
          <textarea
            rows={12}
            className={`${inputClass} font-mono text-[13px] leading-relaxed`}
            placeholder={`e.g. We are looking for a Web Designer to create clean, user-focused interfaces for web and product teams.

Responsibilities:
• Design responsive layouts and component systems
• Collaborate with developers and product managers
• Present concepts and iterate from feedback

Requirements:
• 3+ years of experience in web or product design
• Strong portfolio (Figma, Adobe, or similar)
• Understanding of HTML/CSS basics

Nice to have:
• Experience with design systems
• B2B or SaaS product background`}
            {...form.register("longDescription")}
          />
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update job"
              : "Post job"}
        </Button>
        {isEditing && onCancelEdit && (
          <Button type="button" variant="outline" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
