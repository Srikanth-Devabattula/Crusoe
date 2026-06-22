"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import { getTestimonialPhotoUrl } from "@/lib/uploads";
import { testimonialService } from "@/services";
import type { Testimonial, TestimonialFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  company: z.string().optional(),
  quote: z.string().optional(),
  photo: z.string().optional(),
  rating: z.number().min(1).max(5),
  type: z.enum(["text", "video"]),
  videoUrl: z.string().optional(),
  published: z.boolean(),
  sortOrder: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  name: "",
  title: "",
  company: "",
  quote: "",
  photo: "",
  rating: 5,
  type: "text",
  videoUrl: "",
  published: true,
  sortOrder: 0,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

interface AdminTestimonialFormProps {
  onSuccess: () => void;
  editing?: Testimonial | null;
  onCancelEdit?: () => void;
}

export function AdminTestimonialForm({
  onSuccess,
  editing,
  onCancelEdit,
}: AdminTestimonialFormProps) {
  const isEditing = Boolean(editing);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const type = form.watch("type");

  const existingPhotoUrl = useMemo(() => {
    if (!editing?.photo || photoRemoved) return null;
    return getTestimonialPhotoUrl(editing.photo);
  }, [editing, photoRemoved]);

  useEffect(() => {
    if (editing) {
      const isExternal = /^https?:\/\//i.test(editing.photo ?? "");
      form.reset({
        name: editing.name,
        title: editing.title,
        company: editing.company ?? "",
        quote: editing.quote ?? "",
        photo: isExternal || editing.photo?.startsWith("/") ? editing.photo ?? "" : "",
        rating: editing.rating ?? 5,
        type: editing.type ?? "text",
        videoUrl: editing.videoUrl ?? "",
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
    const payload: TestimonialFormData = {
      name: values.name,
      title: values.title,
      company: values.company?.trim() ?? "",
      quote: values.quote?.trim() ?? "",
      rating: values.rating,
      type: values.type,
      videoUrl: values.videoUrl?.trim() ?? "",
      published: values.published,
      sortOrder: values.sortOrder ?? 0,
    };

    const photoChanged = Boolean(photoFile) || photoRemoved || Boolean(values.photo?.trim());
    if (photoChanged) {
      payload.photo = photoFile ? "" : photoRemoved ? "" : values.photo?.trim() ?? "";
    }

    const options = {
      photoFile,
      removePhoto: photoRemoved && !photoFile,
    };

    try {
      if (isEditing && editing) {
        await testimonialService.update(editing._id, payload, options);
        toast.success("Testimonial updated");
      } else {
        await testimonialService.create(payload, options);
        toast.success("Testimonial created");
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
        {isEditing ? "Edit testimonial" : "New testimonial"}
      </h2>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Type</label>
            <select {...form.register("type")} className={inputClass}>
              <option value="text">Text quote</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Sort order</label>
            <input type="number" {...form.register("sortOrder", { valueAsNumber: true })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Name *</label>
          <input {...form.register("name")} className={inputClass} />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Title *</label>
          <input {...form.register("title")} className={inputClass} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Company</label>
          <input {...form.register("company")} className={inputClass} />
        </div>

        {type === "text" && (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-800">Quote *</label>
              <textarea {...form.register("quote")} rows={4} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-800">Rating (1-5)</label>
              <input type="number" min={1} max={5} {...form.register("rating", { valueAsNumber: true })} className={inputClass} />
            </div>
          </>
        )}

        {type === "video" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">Video URL</label>
            <input {...form.register("videoUrl")} className={inputClass} placeholder="YouTube or Vimeo URL" />
          </div>
        )}

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
            placeholder="Or photo URL /images/..."
            disabled={Boolean(photoFile)}
          />
          {existingPhotoUrl && !photoFile && (
            <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-full">
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
