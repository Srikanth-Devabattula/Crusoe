"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import { getHeroSlideIconUrl, getHeroSlideImageUrl } from "@/lib/uploads";
import { heroSlideService } from "@/services";
import type { HeroSlide, HeroSlideFormData } from "@/types";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  image: z.string().optional(),
  icon: z.string().optional(),
  published: z.boolean(),
  sortOrder: z.number().optional(),
  ctaLink: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  title: "",
  description: "",
  image: "",
  icon: "",
  published: true,
  sortOrder: 0,
  ctaLink: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

interface AdminHeroSlideFormProps {
  onSuccess: () => void;
  editing?: HeroSlide | null;
  onCancelEdit?: () => void;
}

export function AdminHeroSlideForm({
  onSuccess,
  editing,
  onCancelEdit,
}: AdminHeroSlideFormProps) {
  const isEditing = Boolean(editing);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [iconRemoved, setIconRemoved] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const existingImageUrl = useMemo(() => {
    if (!editing?.image || imageRemoved) return null;
    return getHeroSlideImageUrl(editing.image);
  }, [editing, imageRemoved]);

  const existingIconUrl = useMemo(() => {
    if (!editing?.icon || iconRemoved) return null;
    return getHeroSlideIconUrl(editing.icon);
  }, [editing, iconRemoved]);

  useEffect(() => {
    if (editing) {
      const isExternalImage = /^https?:\/\//i.test(editing.image ?? "");
      const isExternalIcon = /^https?:\/\//i.test(editing.icon ?? "");
      form.reset({
        title: editing.title,
        description: editing.description,
        image:
          isExternalImage || editing.image?.startsWith("/") ? editing.image ?? "" : "",
        icon: isExternalIcon || editing.icon?.startsWith("/") ? editing.icon ?? "" : "",
        published: editing.published,
        sortOrder: editing.sortOrder ?? 0,
        ctaLink: editing.ctaLink ?? "",
      });
      setImageFile(null);
      setIconFile(null);
      setImageRemoved(false);
      setIconRemoved(false);
    } else {
      form.reset(defaultValues);
      setImageFile(null);
      setIconFile(null);
      setImageRemoved(false);
      setIconRemoved(false);
    }
  }, [editing, form]);

  const onSubmit = async (values: FormValues) => {
    const payload: HeroSlideFormData = {
      title: values.title.trim(),
      description: values.description.trim(),
      published: values.published,
      sortOrder: values.sortOrder ?? 0,
      ctaLink: values.ctaLink?.trim() || "",
    };

    const imageChanged = Boolean(imageFile) || imageRemoved || Boolean(values.image?.trim());
    const iconChanged = Boolean(iconFile) || iconRemoved || Boolean(values.icon?.trim());

    if (imageChanged) {
      payload.image = imageFile ? "" : imageRemoved ? "" : values.image?.trim() ?? "";
    } else if (!isEditing) {
      toast.error("Hero image is required");
      return;
    }

    if (iconChanged) {
      payload.icon = iconFile ? "" : iconRemoved ? "" : values.icon?.trim() ?? "";
    } else if (!isEditing) {
      toast.error("Icon image is required");
      return;
    }

    const options = {
      imageFile,
      iconFile,
      removeImage: imageRemoved && !imageFile,
      removeIcon: iconRemoved && !iconFile,
    };

    try {
      if (isEditing && editing) {
        await heroSlideService.update(editing._id, payload, options);
        toast.success("Hero slide updated");
      } else {
        await heroSlideService.create(payload, options);
        toast.success("Hero slide added");
      }
      form.reset(defaultValues);
      setImageFile(null);
      setIconFile(null);
      setImageRemoved(false);
      setIconRemoved(false);
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
        {isEditing ? "Edit hero slide" : "Add hero slide"}
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Title *</label>
          <input {...form.register("title")} className={inputClass} placeholder="Quality Assurance" />
          {form.formState.errors.title && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Description *</label>
          <textarea
            {...form.register("description")}
            rows={4}
            className={inputClass}
            placeholder="Slide description..."
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Sort order</label>
          <input
            type="number"
            {...form.register("sortOrder", { valueAsNumber: true })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">CTA Link</label>
          <input
            type="text"
            {...form.register("ctaLink")}
            className={inputClass}
            placeholder="e.g. /services/software-quality or /contact"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Hero image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImageFile(e.target.files?.[0] ?? null);
              setImageRemoved(false);
            }}
            className="block w-full text-sm text-gray-600"
          />
          <input
            {...form.register("image")}
            className={`${inputClass} mt-2`}
            placeholder="Or image path: /images/hero/card1.png"
            disabled={Boolean(imageFile)}
          />
          {existingImageUrl && !imageFile && (
            <div className="relative mt-2 h-28 w-full max-w-sm overflow-hidden rounded-lg border border-gray-100">
              <Image src={existingImageUrl} alt="" fill unoptimized className="object-cover" />
            </div>
          )}
          {(existingImageUrl || imageFile) && (
            <button
              type="button"
              className="mt-2 text-sm text-red-600"
              onClick={() => {
                setImageFile(null);
                setImageRemoved(true);
                form.setValue("image", "");
              }}
            >
              Remove image
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Icon image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setIconFile(e.target.files?.[0] ?? null);
              setIconRemoved(false);
            }}
            className="block w-full text-sm text-gray-600"
          />
          <input
            {...form.register("icon")}
            className={`${inputClass} mt-2`}
            placeholder="Or icon path: /images/hero/card1icon.png"
            disabled={Boolean(iconFile)}
          />
          {existingIconUrl && !iconFile && (
            <div className="relative mt-2 h-16 w-16 overflow-hidden rounded-lg border border-gray-100 bg-white">
              <Image src={existingIconUrl} alt="" fill unoptimized className="object-contain p-2" />
            </div>
          )}
          {(existingIconUrl || iconFile) && (
            <button
              type="button"
              className="mt-2 text-sm text-red-600"
              onClick={() => {
                setIconFile(null);
                setIconRemoved(true);
                form.setValue("icon", "");
              }}
            >
              Remove icon
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
