"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import {
  AdminMediaFields,
  type AdminMediaState,
} from "@/components/admin/AdminMediaFields";
import { Button } from "@/components/ui/Button";
import { dateInputToIso, toDateInputValue } from "@/lib/publishDate";
import { getNewsCoverUrl } from "@/lib/uploads";
import { getPostVideoUrls } from "@/lib/video";
import { newsService } from "@/services";
import type { News, NewsCategoryItem, NewsFormData } from "@/types";

const newsSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      "Slug: lowercase letters, numbers, hyphens only"
    ),
  excerpt: z.string().min(20, "Excerpt is required (min 20 characters)").max(400),
  content: z.string().min(50, "Content is required (min 50 characters)"),
  category: z.string().min(1, "Category is required"),
  publishDate: z.string().min(1, "Publish date is required"),
  featured: z.boolean(),
  published: z.boolean(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

const defaultValues: NewsFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "announcements",
  publishDate: toDateInputValue(),
  featured: false,
  published: false,
};

const emptyMediaState: AdminMediaState = {
  keepImages: [],
  removeImages: [],
  galleryFiles: [],
  imageUrls: [],
  removeAllImages: false,
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

function getExistingImageRefs(news?: News | null): string[] {
  if (!news) return [];
  if (news.images?.length) return news.images;
  if (news.coverImage) return [news.coverImage];
  return [];
}

interface AdminNewsFormProps {
  onSuccess: () => void;
  editingNews?: News | null;
  categories: NewsCategoryItem[];
  onCancelEdit?: () => void;
}

export function AdminNewsForm({
  onSuccess,
  editingNews,
  categories,
  onCancelEdit,
}: AdminNewsFormProps) {
  const isEditing = Boolean(editingNews);
  const [mediaState, setMediaState] = useState<AdminMediaState>(emptyMediaState);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues,
  });

  const existingImageRefs = useMemo(
    () => getExistingImageRefs(editingNews),
    [editingNews]
  );

  const handleMediaChange = useCallback((state: AdminMediaState) => {
    setMediaState(state);
  }, []);

  useEffect(() => {
    if (editingNews) {
      const categorySlug =
        categories.some((c) => c.slug === editingNews.category)
          ? editingNews.category
          : categories[0]?.slug ?? "announcements";
      form.reset({
        title: editingNews.title,
        slug: editingNews.slug,
        excerpt: editingNews.excerpt ?? "",
        content: editingNews.content ?? "",
        category: categorySlug,
        publishDate: toDateInputValue(editingNews.publishedAt ?? editingNews.createdAt),
        featured: editingNews.featured ?? false,
        published: editingNews.published,
      });
      setVideoUrls(getPostVideoUrls(editingNews));
    } else {
      form.reset({
        ...defaultValues,
        category: categories[0]?.slug ?? "announcements",
        publishDate: toDateInputValue(),
      });
      setVideoUrls([]);
    }
    setMediaState(emptyMediaState);
  }, [editingNews, categories, form]);

  const onSubmit = async (values: NewsFormValues) => {
    const payload: NewsFormData = {
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      publishedAt: dateInputToIso(values.publishDate),
      featured: values.featured,
      published: values.published,
      slug: values.slug?.trim() || undefined,
      videoUrls,
    };

    const hasMediaChanges =
      mediaState.galleryFiles.length > 0 ||
      mediaState.removeImages.length > 0 ||
      mediaState.imageUrls.length > 0 ||
      mediaState.removeAllImages;

    const mediaOptions =
      hasMediaChanges || (isEditing && existingImageRefs.length > 0)
        ? {
            galleryFiles: mediaState.galleryFiles,
            keepImages: mediaState.keepImages,
            removeImages: mediaState.removeImages,
            imageUrls: mediaState.imageUrls,
            removeAllImages: mediaState.removeAllImages,
          }
        : hasMediaChanges
          ? {
              galleryFiles: mediaState.galleryFiles,
              imageUrls: mediaState.imageUrls,
            }
          : undefined;

    try {
      if (isEditing && editingNews) {
        await newsService.update(editingNews._id, payload, mediaOptions);
        toast.success("News updated");
      } else {
        await newsService.create(payload, mediaOptions);
        toast.success("News created");
      }
      form.reset(defaultValues);
      setMediaState(emptyMediaState);
      setVideoUrls([]);
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
        {isEditing ? "Edit news article" : "New news article"}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Fields marked with <span className="text-red-500">*</span> are required. Published
        articles appear on the public news page.
      </p>

      <div className="mt-6 space-y-5">
        <Field label="Title" required error={form.formState.errors.title?.message}>
          <input {...form.register("title")} className={inputClass} placeholder="News headline" required />
        </Field>

        <Field label="Slug" hint="Leave blank to auto-generate from title" error={form.formState.errors.slug?.message}>
          <input {...form.register("slug")} className={inputClass} placeholder="company-announcement" />
        </Field>

        <Field label="Category" required error={form.formState.errors.category?.message}>
          {categories.length === 0 ? (
            <p className="text-sm text-amber-700">Add at least one news category before creating an article.</p>
          ) : (
            <select {...form.register("category")} className={inputClass} required>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          label="Publish date"
          required
          hint="Shown on the public news page"
          error={form.formState.errors.publishDate?.message}
        >
          <input
            type="date"
            {...form.register("publishDate")}
            className={inputClass}
          />
        </Field>

        <AdminMediaFields
          mediaType="news"
          existingImages={existingImageRefs}
          resolveImageUrl={getNewsCoverUrl}
          videoUrls={videoUrls}
          onVideoUrlsChange={setVideoUrls}
          onMediaChange={handleMediaChange}
        />

        <Field label="Excerpt" required error={form.formState.errors.excerpt?.message}>
          <textarea {...form.register("excerpt")} rows={3} className={inputClass} placeholder="Short summary" required />
        </Field>

        <Field label="Content" required error={form.formState.errors.content?.message}>
          <textarea
            {...form.register("content")}
            rows={12}
            className={inputClass}
            placeholder="Full news body. Line breaks are preserved."
            required
          />
        </Field>

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" {...form.register("published")} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
            Published
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" {...form.register("featured")} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
            Featured (hero on news page)
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="submit" disabled={form.formState.isSubmitting || categories.length === 0}>
          {form.formState.isSubmitting ? "Saving..." : isEditing ? "Update article" : "Create article"}
        </Button>
        {isEditing && onCancelEdit && (
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            Cancel edit
          </Button>
        )}
      </div>
    </form>
  );
}
