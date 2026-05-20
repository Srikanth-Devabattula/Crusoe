import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiClock } from "react-icons/fi";

import { BLOG_CATEGORY_STYLES } from "@/data/blogCategories";
import { ROUTES } from "@/constants";
import {
  estimateReadTime,
  formatBlogCategory,
  formatBlogDate,
  getBlogCoverStyle,
} from "@/lib/blog";
import { getBlogCoverUrl } from "@/lib/uploads";
import { cn } from "@/lib/cn";
import type { Blog } from "@/types";

interface BlogCardProps {
  post: Blog;
  variant?: "default" | "compact";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const styles = BLOG_CATEGORY_STYLES[post.category];
  const readTime = estimateReadTime(post.content);
  const coverSrc = getBlogCoverUrl(post.coverImage);

  return (
    <Link
      href={ROUTES.blogPost(post.slug)}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E8EEF5] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_12px_40px_rgba(108,191,42,0.12)]",
        variant === "compact" && "sm:flex-row"
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          variant === "compact" ? "h-40 w-full sm:h-auto sm:w-44" : "h-48 w-full"
        )}
      >
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              getBlogCoverStyle(post.category)
            )}
          />
        )}
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
          style={{ backgroundColor: styles.bg, color: styles.text }}
        >
          {formatBlogCategory(post.category)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-medium text-slate-500">{formatBlogDate(post.createdAt)}</p>
        <h3
          className={cn(
            "mt-2 font-bold text-slate-900 transition-colors group-hover:text-brand",
            variant === "compact" ? "text-lg" : "text-xl"
          )}
        >
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <FiClock className="h-3.5 w-3.5" aria-hidden />
            {readTime} min read
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
            Read more
            <FiArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
