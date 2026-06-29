"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import { getPartnerLogoUrl } from "@/lib/uploads";
import { partnerService } from "@/services";
import type { Partner, PartnerFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Company name is required"),
  logo: z.string().optional(),
  websiteUrl: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/i.test(val), "Must be a valid URL"),
  published: z.boolean(),
  sortOrder: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  name: "",
  logo: "",
  websiteUrl: "",
  published: true,
  sortOrder: 0,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

interface AdminPartnerFormProps {
  onSuccess: () => void;
  editing?: Partner | null;
  onCancelEdit?: () => void;
}

export function AdminPartnerForm({ onSuccess, editing, onCancelEdit }: AdminPartnerFormProps) {
  const isEditing = Boolean(editing);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const existingLogoUrl = useMemo(() => {
    if (!editing?.logo || logoRemoved) return null;
    return getPartnerLogoUrl(editing.logo);
  }, [editing, logoRemoved]);

  useEffect(() => {
    if (editing) {
      const isExternal = /^https?:\/\//i.test(editing.logo ?? "");
      form.reset({
        name: editing.name,
        logo: isExternal || editing.logo?.startsWith("/") ? editing.logo ?? "" : "",
        websiteUrl: editing.websiteUrl ?? "",
        published: editing.published,
        sortOrder: editing.sortOrder ?? 0,
      });
      setLogoFile(null);
      setLogoRemoved(false);
    } else {
      form.reset(defaultValues);
      setLogoFile(null);
      setLogoRemoved(false);
    }
  }, [editing, form]);

  const onSubmit = async (values: FormValues) => {
    const payload: PartnerFormData = {
      name: values.name,
      websiteUrl: values.websiteUrl?.trim() ?? "",
      published: values.published,
      sortOrder: values.sortOrder ?? 0,
    };

    const logoChanged = Boolean(logoFile) || logoRemoved || Boolean(values.logo?.trim());
    if (logoChanged) {
      payload.logo = logoFile ? "" : logoRemoved ? "" : values.logo?.trim() ?? "";
    } else if (!isEditing) {
      toast.error("Logo is required");
      return;
    }

    const options = { logoFile, removeLogo: logoRemoved && !logoFile };

    try {
      if (isEditing && editing) {
        await partnerService.update(editing._id, payload, options);
        toast.success("Partner updated");
      } else {
        await partnerService.create(payload as PartnerFormData, options);
        toast.success("Partner added");
      }
      form.reset(defaultValues);
      setLogoFile(null);
      setLogoRemoved(false);
      onSuccess();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditing ? "Edit partner logo" : "Add partner logo"}
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Company name *</label>
          <input {...form.register("name")} className={inputClass} placeholder="Juniper" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Sort order</label>
          <input type="number" {...form.register("sortOrder", { valueAsNumber: true })} className={inputClass} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Logo *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setLogoFile(e.target.files?.[0] ?? null);
              setLogoRemoved(false);
            }}
            className="block w-full text-sm text-gray-600"
          />
          <input
            {...form.register("logo")}
            className={`${inputClass} mt-2`}
            placeholder="Or logo path: /icons/logo1.png"
            disabled={Boolean(logoFile)}
          />
          {existingLogoUrl && !logoFile && (
            <div className="relative mt-2 h-16 w-40">
              <Image src={existingLogoUrl} alt="" fill unoptimized className="object-contain object-left" />
            </div>
          )}
          {(existingLogoUrl || logoFile) && (
            <button
              type="button"
              className="mt-2 text-sm text-red-600"
              onClick={() => {
                setLogoFile(null);
                setLogoRemoved(true);
                form.setValue("logo", "");
              }}
            >
              Remove logo
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Website URL</label>
          <input {...form.register("websiteUrl")} className={inputClass} placeholder="https://..." />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("published")} className="h-4 w-4" />
          Published
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
        </Button>
        {isEditing && onCancelEdit && (
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
