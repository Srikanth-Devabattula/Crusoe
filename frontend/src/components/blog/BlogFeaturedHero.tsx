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

interface BlogFeaturedHeroProps {
  post: Blog;
}

export function BlogFeaturedHero({ post }: BlogFeaturedHeroProps) {
  const styles = BLOG_CATEGORY_STYLES[post.category];
  const readTime = estimateReadTime(post.content);
  const coverSrc = getBlogCoverUrl(post.coverImage);

  return (
    <section className="bg-white pb-4 pt-2 sm:pb-6">
      <div className="hero-container">
        <Link
          href={ROUTES.blogPost(post.slug)}
          className="group relative grid overflow-hidden rounded-[24px] border border-[#E8EEF5] bg-white shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition hover:border-brand/30 lg:grid-cols-[1.15fr_1fr]"
        >
          <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[360px]">
            {coverSrc ? (
              <Image
                src={coverSrc}
                alt=""
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
              />
            ) : (
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br",
                  getBlogCoverStyle(post.category)
                )}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/20" />
            <span className="absolute left-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Featured
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <span
              className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: styles.bg, color: styles.text }}
            >
              {formatBlogCategory(post.category)}
            </span>
            <p className="mt-4 text-sm text-slate-500">{formatBlogDate(post.createdAt)}</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-brand sm:text-3xl lg:text-4xl">
              {post.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 line-clamp-4 sm:text-lg">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <FiClock className="h-4 w-4" aria-hidden />
                {readTime} min read
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                Read featured article
                <FiArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
