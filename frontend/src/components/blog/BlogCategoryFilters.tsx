"use client";

import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/data/blogCategories";
import { cn } from "@/lib/cn";
import type { BlogCategory } from "@/types";

export type BlogFilterCategory = BlogCategory | "all";

interface BlogCategoryFiltersProps {
  active: BlogFilterCategory;
  onChange: (category: BlogFilterCategory) => void;
  counts?: Partial<Record<BlogFilterCategory, number>>;
}

export function BlogCategoryFilters({
  active,
  onChange,
  counts,
}: BlogCategoryFiltersProps) {
  const items: { id: BlogFilterCategory; label: string }[] = [
    { id: "all", label: "All" },
    ...BLOG_CATEGORIES.map((id) => ({
      id,
      label: BLOG_CATEGORY_LABELS[id],
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ id, label }) => {
        const count = counts?.[id];
        const isActive = active === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              isActive
                ? "bg-brand text-white shadow-[0_8px_24px_rgba(108,191,42,0.28)]"
                : "border border-[#E8EEF5] bg-white text-slate-700 hover:border-brand/30 hover:text-brand"
            )}
          >
            {label}
            {count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 text-xs",
                  isActive ? "text-white/80" : "text-slate-400"
                )}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
