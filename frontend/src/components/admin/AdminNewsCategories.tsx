"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api-error";
import { newsCategoryService } from "@/services/newsCategory.service";
import type { NewsCategoryItem } from "@/types";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

interface AdminNewsCategoriesProps {
  categories: NewsCategoryItem[];
  isLoading: boolean;
  onChanged: () => void;
}

export function AdminNewsCategories({
  categories,
  isLoading,
  onChanged,
}: AdminNewsCategoriesProps) {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Enter a category name");
      return;
    }

    setIsSaving(true);
    try {
      await newsCategoryService.create({ name: trimmed });
      toast.success("Category added");
      setName("");
      onChanged();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: NewsCategoryItem) => {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    try {
      await newsCategoryService.delete(category._id);
      toast.success("Category deleted");
      onChanged();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">News categories</h2>
      <p className="mt-1 text-sm text-gray-500">
        Add categories for filtering on the public news page.
      </p>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Product Launch"
          required
          className={`${inputClass} min-w-[200px] flex-1`}
        />
        <Button type="submit" disabled={isSaving} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" aria-hidden />
          {isSaving ? "Adding..." : "Add category"}
        </Button>
      </form>

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-500">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No categories yet.</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <li
              key={category._id}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-800"
            >
              <span className="font-medium">{category.name}</span>
              <span className="text-xs text-gray-400">({category.slug})</span>
              <button
                type="button"
                onClick={() => handleDelete(category)}
                className="rounded p-0.5 text-gray-500 hover:bg-white hover:text-red-600"
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
