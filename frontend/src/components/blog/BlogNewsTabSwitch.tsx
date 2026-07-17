"use client";

import { cn } from "@/lib/cn";

export type BlogNewsTab = "blog" | "news";

interface BlogNewsTabSwitchProps {
  active: BlogNewsTab;
  onChange: (tab: BlogNewsTab) => void;
  className?: string;
}

const tabs: { id: BlogNewsTab; label: string }[] = [
  { id: "blog", label: "Blog" },
  { id: "news", label: "News" },
];

export function BlogNewsTabSwitch({
  active,
  onChange,
  className,
}: BlogNewsTabSwitchProps) {
  return (
    <div
      className={cn("flex justify-center", className)}
      role="tablist"
      aria-label="Browse blogs or news"
    >
      <div className="inline-flex rounded-full border border-[#E8EEF5] bg-white p-1.5 shadow-sm">
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                "min-w-[108px] rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-[0.08em] transition-all duration-200 sm:min-w-[120px] sm:px-8 sm:py-3 sm:text-base",
                isActive
                  ? "bg-brand text-white shadow-[0_8px_24px_rgba(126,168,73,0.28)]"
                  : "text-slate-500 hover:text-brand"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
