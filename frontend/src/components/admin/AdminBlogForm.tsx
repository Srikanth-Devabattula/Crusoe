"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/data/blogCategories";
import { getApiErrorMessage } from "@/lib/api-error";
import { blogService } from "@/services";
import type { Blog, BlogCategory } from "@/types";

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
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.enum(BLOG_CATEGORIES as [BlogCategory, ...BlogCategory[]]),
  coverImage: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/i.test(val), "Must be a valid URL"),
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
  coverImage: "",
  featured: false,
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

interface AdminBlogFormProps {
  onSuccess: () => void;
  editingBlog?: Blog | null;
  onCancelEdit?: () => void;
}

export function AdminBlogForm({
  onSuccess,
  editingBlog,
  onCancelEdit,
}: AdminBlogFormProps) {
  const isEditing = Boolean(editingBlog);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingBlog) {
      form.reset({
        title: editingBlog.title,
        slug: editingBlog.slug,
        excerpt: editingBlog.excerpt ?? "",
        content: editingBlog.content ?? "",
        category: editingBlog.category ?? "insights",
        coverImage: editingBlog.coverImage ?? "",
        featured: editingBlog.featured ?? false,
        published: editingBlog.published,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editingBlog, form]);

  const onSubmit = async (values: BlogFormValues) => {
    const payload = {
      ...values,
      slug: values.slug?.trim() || undefined,
      coverImage: values.coverImage?.trim() || "",
    };

    try {
      if (isEditing && editingBlog) {
        await blogService.update(editingBlog._id, payload);
        toast.success("Blog updated");
      } else {
        await blogService.create(payload);
        toast.success("Blog created");
      }
      form.reset(defaultValues);
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
          <select {...form.register("category")} className={inputClass}>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {BLOG_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Cover image URL"
          hint="Optional. Use a full https:// image URL for the card and hero."
          error={form.formState.errors.coverImage?.message}
        >
          <input
            {...form.register("coverImage")}
            className={inputClass}
            placeholder="https://example.com/image.jpg"
          />
        </Field>

        <Field label="Excerpt" required error={form.formState.errors.excerpt?.message}>
          <textarea
            {...form.register("excerpt")}
            rows={3}
            className={inputClass}
            placeholder="Short summary for cards and SEO"
          />
        </Field>

        <Field label="Content" required error={form.formState.errors.content?.message}>
          <textarea
            {...form.register("content")}
            rows={12}
            className={inputClass}
            placeholder="Full article body. Line breaks are preserved on the post page."
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
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
