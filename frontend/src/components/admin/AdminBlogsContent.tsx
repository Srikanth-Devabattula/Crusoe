"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { AdminBlogForm } from "@/components/admin/AdminBlogForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BLOG_CATEGORY_LABELS } from "@/data/blogCategories";
import { ROUTES } from "@/constants";
import { getApiErrorMessage } from "@/lib/api-error";
import { blogService } from "@/services";
import type { Blog } from "@/types";

export function AdminBlogsContent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

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

  const handleDelete = async (blog: Blog) => {
    if (!confirm(`Delete "${blog.title}"?`)) return;

    try {
      await blogService.delete(blog._id);
      toast.success("Blog deleted");
      if (editingBlog?._id === blog._id) setEditingBlog(null);
      loadBlogs();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <>
      <AdminHeader title="Blog posts" />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <AdminBlogForm
          editingBlog={editingBlog}
          onCancelEdit={() => setEditingBlog(null)}
          onSuccess={() => {
            setEditingBlog(null);
            loadBlogs();
          }}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">All posts</h2>
          <p className="mt-1 text-sm text-gray-500">
            {blogs.length} post{blogs.length === 1 ? "" : "s"}
          </p>

          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading...</p>
          ) : blogs.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No posts yet. Create your first article using the form.
            </p>
          ) : (
            <ul className="mt-6 max-h-[720px] space-y-3 overflow-y-auto pr-1">
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
                          {BLOG_CATEGORY_LABELS[blog.category] ?? blog.category}
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
                        onClick={() => setEditingBlog(blog)}
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
      </div>
    </>
  );
}
