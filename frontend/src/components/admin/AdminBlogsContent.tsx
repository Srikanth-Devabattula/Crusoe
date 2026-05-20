"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { AdminBlogCategories } from "@/components/admin/AdminBlogCategories";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { getApiErrorMessage } from "@/lib/api-error";
import { blogService } from "@/services";
import type { Blog } from "@/types";

export function AdminBlogsContent() {
  const { categories, isLoading: categoriesLoading, reload, getLabel } =
    useBlogCategories();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadBlogs = useCallback(async () => {
    try {
      const res = await blogService.getAll();
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const closeForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const openNewForm = () => {
    setEditingBlog(null);
    setShowForm(true);
  };

  const openEditForm = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleDelete = async (blog: Blog) => {
    if (!confirm(`Delete "${blog.title}"?`)) return;

    try {
      await blogService.delete(blog._id);
      toast.success("Blog deleted");
      if (editingBlog?._id === blog._id) closeForm();
      loadBlogs();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (showForm) {
    return (
      <>
        <AdminHeader title={editingBlog ? "Edit blog post" : "New blog post"} />

        <button
          type="button"
          onClick={closeForm}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to all posts
        </button>

        <AdminBlogCategories
          categories={categories}
          isLoading={categoriesLoading}
          onChanged={reload}
        />

        <AdminBlogForm
          editingBlog={editingBlog}
          categories={categories}
          onCancelEdit={closeForm}
          onSuccess={() => {
            closeForm();
            loadBlogs();
          }}
        />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Blog posts" />

      <AdminBlogCategories
        categories={categories}
        isLoading={categoriesLoading}
        onChanged={reload}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All posts</h2>
            <p className="mt-1 text-sm text-gray-500">
              {blogs.length} post{blogs.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button type="button" onClick={openNewForm} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Add new blog
          </Button>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-gray-500">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            No posts yet. Click &quot;Add new blog&quot; to create your first article.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {blogs.map((blog) => (
              <li
                key={blog._id}
                className="rounded-lg border border-gray-100 bg-gray-50/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{blog.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                      {blog.excerpt || "No excerpt"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-700">
                          {getLabel(blog.category)}
                        </span>
                      {blog.featured && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          blog.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {blog.published && (
                      <Link
                        href={ROUTES.blogPost(blog.slug)}
                        target="_blank"
                        className="rounded-md p-2 text-gray-600 hover:bg-white hover:text-brand"
                        aria-label={`View ${blog.title}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => openEditForm(blog)}
                      className="rounded-md p-2 text-gray-600 hover:bg-white hover:text-gray-900"
                      aria-label={`Edit ${blog.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog)}
                      className="rounded-md p-2 text-gray-600 hover:bg-white hover:text-red-600"
                      aria-label={`Delete ${blog.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
