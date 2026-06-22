"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import { getTeamPhotoUrl } from "@/lib/uploads";
import { teamService } from "@/services";
import type { TeamMember, TeamMemberFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role is required"),
  bio: z.string().optional(),
  photo: z.string().optional(),
  linkedIn: z.string().optional(),
  twitter: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  published: z.boolean(),
  sortOrder: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  name: "",
  role: "",
  bio: "",
  photo: "",
  linkedIn: "",
  twitter: "",
  email: "",
  published: true,
  sortOrder: 0,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

interface AdminTeamMemberFormProps {
  onSuccess: () => void;
  editing?: TeamMember | null;
  onCancelEdit?: () => void;
}

export function AdminTeamMemberForm({
  onSuccess,
  editing,
  onCancelEdit,
}: AdminTeamMemberFormProps) {
  const isEditing = Boolean(editing);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const existingPhotoUrl = useMemo(() => {
    if (!editing?.photo || photoRemoved) return null;
    return getTeamPhotoUrl(editing.photo);
  }, [editing, photoRemoved]);

  useEffect(() => {
    if (editing) {
      const isExternal = /^https?:\/\//i.test(editing.photo ?? "");
      form.reset({
        name: editing.name,
        role: editing.role,
        bio: editing.bio ?? "",
        photo: isExternal || editing.photo?.startsWith("/") ? editing.photo ?? "" : "",
        linkedIn: editing.linkedIn ?? "",
        twitter: editing.twitter ?? "",
        email: editing.email ?? "",
        published: editing.published,
        sortOrder: editing.sortOrder ?? 0,
      });
      setPhotoFile(null);
      setPhotoRemoved(false);
    } else {
      form.reset(defaultValues);
      setPhotoFile(null);
      setPhotoRemoved(false);
    }
  }, [editing, form]);

  const onSubmit = async (values: FormValues) => {
    const payload: TeamMemberFormData = {
      name: values.name,
      role: values.role,
      bio: values.bio?.trim() ?? "",
      linkedIn: values.linkedIn?.trim() ?? "",
      twitter: values.twitter?.trim() ?? "",
      email: values.email?.trim() ?? "",
      published: values.published,
      sortOrder: values.sortOrder ?? 0,
    };

    const photoChanged = Boolean(photoFile) || photoRemoved || Boolean(values.photo?.trim());
    if (photoChanged) {
      payload.photo = photoFile ? "" : photoRemoved ? "" : values.photo?.trim() ?? "";
    }

    const options = { photoFile, removePhoto: photoRemoved && !photoFile };

    try {
      if (isEditing && editing) {
        await teamService.update(editing._id, payload, options);
        toast.success("Team member updated");
      } else {
        await teamService.create(payload, options);
        toast.success("Team member created");
      }
      form.reset(defaultValues);
      setPhotoFile(null);
      setPhotoRemoved(false);
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
        {isEditing ? "Edit team member" : "New team member"}
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Name *</label>
          <input {...form.register("name")} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Role *</label>
          <input {...form.register("role")} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Bio</label>
          <textarea {...form.register("bio")} rows={3} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Sort order</label>
          <input type="number" {...form.register("sortOrder", { valueAsNumber: true })} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setPhotoFile(e.target.files?.[0] ?? null);
              setPhotoRemoved(false);
            }}
            className="block w-full text-sm text-gray-600"
          />
          <input
            {...form.register("photo")}
            className={`${inputClass} mt-2`}
            placeholder="Or photo URL /images/aboutus/team/..."
            disabled={Boolean(photoFile)}
          />
          {existingPhotoUrl && !photoFile && (
            <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-xl">
              <Image src={existingPhotoUrl} alt="" fill unoptimized className="object-cover" />
            </div>
          )}
          {(existingPhotoUrl || photoFile) && (
            <button
              type="button"
              className="mt-2 text-sm text-red-600"
              onClick={() => {
                setPhotoFile(null);
                setPhotoRemoved(true);
                form.setValue("photo", "");
              }}
            >
              Remove photo
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">LinkedIn URL</label>
            <input {...form.register("linkedIn")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Twitter URL</label>
            <input {...form.register("twitter")} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Email</label>
          <input {...form.register("email")} className={inputClass} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("published")} className="h-4 w-4" />
          Published
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
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
