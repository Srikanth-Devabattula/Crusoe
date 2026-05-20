"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { AdminNewsCategories } from "@/components/admin/AdminNewsCategories";
import { AdminNewsForm } from "@/components/admin/AdminNewsForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import { getApiErrorMessage } from "@/lib/api-error";
import { newsService } from "@/services";
import type { News } from "@/types";

export function AdminNewsContent() {
  const { categories, isLoading: categoriesLoading, reload, getLabel } = useNewsCategories();
  const [items, setItems] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const res = await newsService.getAll();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const closeForm = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  const handleDelete = async (item: News) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await newsService.delete(item._id);
      toast.success("News deleted");
      if (editingNews?._id === item._id) closeForm();
      loadItems();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (showForm) {
    return (
      <>
        <AdminHeader title={editingNews ? "Edit news article" : "New news article"} />
        <button
          type="button"
          onClick={closeForm}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to all news
        </button>
        <AdminNewsCategories categories={categories} isLoading={categoriesLoading} onChanged={reload} />
        <AdminNewsForm
          editingNews={editingNews}
          categories={categories}
          onCancelEdit={closeForm}
          onSuccess={() => {
            closeForm();
            loadItems();
          }}
        />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Company news" />
      <AdminNewsCategories categories={categories} isLoading={categoriesLoading} onChanged={reload} />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All news</h2>
            <p className="mt-1 text-sm text-gray-500">
              {items.length} article{items.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => {
              setEditingNews(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add news article
          </Button>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            No news yet. Click &quot;Add news article&quot; to publish company news.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {items.map((item) => (
              <li key={item._id} className="rounded-lg border border-gray-100 bg-gray-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-600">{item.excerpt}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-700">
                        {getLabel(item.category)}
                      </span>
                      {item.featured && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          item.published ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {item.published && (
                      <Link
                        href={ROUTES.newsArticle(item.slug)}
                        target="_blank"
                        className="rounded-md p-2 text-gray-600 hover:bg-white hover:text-brand"
                        aria-label={`View ${item.title}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNews(item);
                        setShowForm(true);
                      }}
                      className="rounded-md p-2 text-gray-600 hover:bg-white hover:text-gray-900"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-md p-2 text-gray-600 hover:bg-white hover:text-red-600"
                      aria-label={`Delete ${item.title}`}
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
