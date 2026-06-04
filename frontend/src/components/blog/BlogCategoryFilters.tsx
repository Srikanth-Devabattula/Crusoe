"use client";

import { cn } from "@/lib/cn";
import type { BlogCategoryItem } from "@/types";

export type BlogFilterCategory = "all" | string;

interface BlogCategoryFiltersProps {
  categories: BlogCategoryItem[];
  active: BlogFilterCategory;
  onChange: (category: BlogFilterCategory) => void;
  counts?: Partial<Record<BlogFilterCategory, number>>;
}

export function BlogCategoryFilters({
  categories,
  active,
  onChange,
  counts,
}: BlogCategoryFiltersProps) {
  const items: { id: BlogFilterCategory; label: string }[] = [
    { id: "all", label: "All" },
    ...categories.map((cat) => ({
      id: cat.slug,
      label: cat.name,
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
                ? "bg-brand text-white shadow-[0_8px_24px_rgba(126, 168, 73,0.28)]"
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
