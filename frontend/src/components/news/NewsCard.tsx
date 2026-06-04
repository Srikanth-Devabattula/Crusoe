import Link from "next/link";
import { FiArrowRight, FiClock } from "react-icons/fi";

import { CoverImage } from "@/components/common/CoverImage";
import { getNewsCategoryStyle } from "@/data/newsCategories";
import { ROUTES } from "@/constants";
import { estimateNewsReadTime, formatNewsDate } from "@/lib/news";
import { getNewsCoverUrl } from "@/lib/uploads";
import { cn } from "@/lib/cn";
import type { News } from "@/types";

interface NewsCardProps {
  item: News;
  categoryLabel: string;
}

export function NewsCard({ item, categoryLabel }: NewsCardProps) {
  const styles = getNewsCategoryStyle(item.category);
  const readTime = estimateNewsReadTime(item.content);
  const coverSrc = getNewsCoverUrl(item.coverImage);
  const gradientFallback = (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(to bottom right, ${styles.accent}33, ${styles.bg}, #eef4e8)`,
      }}
    />
  );

  return (
    <Link
      href={ROUTES.newsArticle(item.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E8EEF5] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_12px_40px_rgba(126, 168, 73,0.12)]"
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden">
        {coverSrc ? (
          <CoverImage
            src={coverSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            imageClassName="transition duration-500 group-hover:scale-[1.02]"
            fallback={gradientFallback}
          />
        ) : (
          gradientFallback
        )}
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
          style={{ backgroundColor: styles.bg, color: styles.text }}
        >
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-medium text-slate-500">{formatNewsDate(item.createdAt)}</p>
        <h3 className="mt-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-brand">
          {item.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
          {item.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <FiClock className="h-3.5 w-3.5" aria-hidden />
            {readTime} min read
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
            Read more
            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
