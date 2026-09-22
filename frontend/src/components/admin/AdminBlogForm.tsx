"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import {
  AdminMediaFields,
  type AdminMediaState,
} from "@/components/admin/AdminMediaFields";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/Button";
import { plainTextFromHtml, plainTextToEditorHtml } from "@/lib/htmlContent";
import { dateInputToIso, toDateInputValue } from "@/lib/publishDate";
import { getBlogCoverUrl } from "@/lib/uploads";
import { getPostVideoUrls } from "@/lib/video";
import { blogService } from "@/services";
import type { Blog, BlogCategoryItem, BlogFormData } from "@/types";

const blogSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      "Slug: lowercase letters, numbers, hyphens only"
    ),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters").max(400),
  content: z.string().refine(
    (val) => plainTextFromHtml(val).length >= 50,
    "Content must be at least 50 characters"
  ),
  category: z.string().min(1, "Category is required"),
  publishDate: z.string().min(1, "Publish date is required"),
  featured: z.boolean(),
  published: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const defaultValues: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "insights",
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

function getExistingImageRefs(blog?: Blog | null): string[] {
  if (!blog) return [];
  if (blog.images?.length) return blog.images;
  if (blog.coverImage) return [blog.coverImage];
  return [];
}

interface AdminBlogFormProps {
  onSuccess: () => void;
  editingBlog?: Blog | null;
  categories: BlogCategoryItem[];
  onCancelEdit?: () => void;
}

export function AdminBlogForm({
  onSuccess,
  editingBlog,
  categories,
  onCancelEdit,
}: AdminBlogFormProps) {
  const isEditing = Boolean(editingBlog);
  const [mediaState, setMediaState] = useState<AdminMediaState>(emptyMediaState);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues,
  });

  const existingImageRefs = useMemo(
    () => getExistingImageRefs(editingBlog),
    [editingBlog]
  );

  const handleMediaChange = useCallback((state: AdminMediaState) => {
    setMediaState(state);
  }, []);

  useEffect(() => {
    if (editingBlog) {
      const categorySlug =
        categories.some((c) => c.slug === editingBlog.category)
          ? editingBlog.category
          : categories[0]?.slug ?? "insights";
      form.reset({
        title: editingBlog.title,
        slug: editingBlog.slug,
        excerpt: editingBlog.excerpt ?? "",
        content: plainTextToEditorHtml(editingBlog.content ?? ""),
        category: categorySlug,
        publishDate: toDateInputValue(editingBlog.publishedAt ?? editingBlog.createdAt),
        featured: editingBlog.featured ?? false,
        published: editingBlog.published,
      });
      setVideoUrls(getPostVideoUrls(editingBlog));
    } else {
      form.reset({
        ...defaultValues,
        category: categories[0]?.slug ?? "insights",
        publishDate: toDateInputValue(),
      });
      setVideoUrls([]);
    }
    setMediaState(emptyMediaState);
  }, [editingBlog, categories, form]);

  const onSubmit = async (values: BlogFormValues) => {
    const payload: BlogFormData = {
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
      if (isEditing && editingBlog) {
        await blogService.update(editingBlog._id, payload, mediaOptions);
        toast.success("Blog updated");
      } else {
        await blogService.create(payload, mediaOptions);
        toast.success("Blog created");
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
        {isEditing ? "Edit blog post" : "New blog post"}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Published posts appear on the public blog page.
      </p>

      <div className="mt-6 space-y-5">
        <Field label="Title" required error={form.formState.errors.title?.message}>
          <input {...form.register("title")} className={inputClass} placeholder="Post title" />
        </Field>

        <Field
          label="Slug"
          hint="Leave blank to auto-generate from title"
          error={form.formState.errors.slug?.message}
        >
          <input {...form.register("slug")} className={inputClass} placeholder="my-blog-post" />
        </Field>

        <Field label="Category" required error={form.formState.errors.category?.message}>
          {categories.length === 0 ? (
            <p className="text-sm text-amber-700">
              Add at least one category on the posts list page before creating a blog.
            </p>
          ) : (
            <select {...form.register("category")} className={inputClass}>
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
          hint="Shown on the public blog page"
          error={form.formState.errors.publishDate?.message}
        >
          <input
            type="date"
            {...form.register("publishDate")}
            className={inputClass}
          />
        </Field>

        <AdminMediaFields
          mediaType="blog"
          existingImages={existingImageRefs}
          resolveImageUrl={getBlogCoverUrl}
          videoUrls={videoUrls}
          onVideoUrlsChange={setVideoUrls}
          onMediaChange={handleMediaChange}
        />

        <Field label="Excerpt" required error={form.formState.errors.excerpt?.message}>
          <textarea
            {...form.register("excerpt")}
            rows={3}
            className={inputClass}
            placeholder="Short summary for cards and SEO"
          />
        </Field>

        <Field
          label="Content"
          required
          hint="Use the toolbar for bold, lists, alignment, and justified text."
          error={form.formState.errors.content?.message}
        >
          <Controller
            name="content"
            control={form.control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Full article body…"
                aria-invalid={Boolean(form.formState.errors.content)}
              />
            )}
          />
        </Field>

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              {...form.register("published")}
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            Published
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              {...form.register("featured")}
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            Featured (hero on blog page)
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || categories.length === 0}
        >
          {form.formState.isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update post"
              : "Create post"}
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
