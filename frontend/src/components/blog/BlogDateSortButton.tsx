"use client";

import { FiArrowDown, FiArrowUp } from "react-icons/fi";

import { cn } from "@/lib/cn";
import type { DateSort } from "@/lib/publishDate";

interface BlogDateSortButtonProps {
  value: DateSort;
  onChange: (value: DateSort) => void;
  className?: string;
}

export function BlogDateSortButton({
  value,
  onChange,
  className,
}: BlogDateSortButtonProps) {
  const isLatest = value === "latest";

  return (
    <button
      type="button"
      onClick={() => onChange(isLatest ? "oldest" : "latest")}
      aria-label={isLatest ? "Sorted by newest first. Show oldest first." : "Sorted by oldest first. Show newest first."}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#E8EEF5] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand/30 hover:text-brand",
        className
      )}
    >
      {isLatest ? (
        <FiArrowDown className="h-4 w-4 shrink-0 text-brand" aria-hidden />
      ) : (
        <FiArrowUp className="h-4 w-4 shrink-0 text-brand" aria-hidden />
      )}
      {isLatest ? "Latest first" : "Oldest first"}
    </button>
  );
}
