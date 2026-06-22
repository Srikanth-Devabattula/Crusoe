import Link from "next/link";
import { FiArrowRight, FiClock } from "react-icons/fi";

import { CoverImage } from "@/components/common/CoverImage";
import { getCategoryStyle } from "@/data/blogCategories";
import { ROUTES } from "@/constants";
import { estimateReadTime, formatBlogDate } from "@/lib/blog";
import { getBlogPrimaryCoverUrl } from "@/lib/uploads";
import type { Blog } from "@/types";

interface BlogFeaturedHeroProps {
  post: Blog;
  categoryLabel: string;
}

export function BlogFeaturedHero({ post, categoryLabel }: BlogFeaturedHeroProps) {
  const styles = getCategoryStyle(post.category);
  const readTime = estimateReadTime(post.content);
  const coverSrc = getBlogPrimaryCoverUrl(post);

  return (
    <section className="bg-transparent pb-4 pt-2 sm:pb-6">
      <div className="hero-container">
        <Link
          href={ROUTES.blogPost(post.slug)}
          className="group relative grid overflow-hidden rounded-[24px] border border-[#E8EEF5] bg-white shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition hover:border-brand/30 lg:grid-cols-[1.15fr_1fr]"
        >
          <div className="relative flex min-h-[200px] items-center justify-center bg-slate-50/80 sm:min-h-[240px] lg:min-h-[280px]">
            {coverSrc ? (
              <CoverImage
                src={coverSrc}
                alt=""
                width={800}
                height={500}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="relative flex min-h-[200px] items-center justify-center p-3 sm:min-h-[240px] lg:min-h-[280px]"
                imageClassName="h-auto max-h-[200px] w-full object-contain sm:max-h-[240px] lg:max-h-[280px]"
                fallback={
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom right, ${styles.accent}33, ${styles.bg}, #eef4e8)`,
                    }}
                  />
                }
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom right, ${styles.accent}33, ${styles.bg}, #eef4e8)`,
                }}
              />
            )}
            {coverSrc && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/30" />
            )}
            <span className="absolute left-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Featured
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <span
              className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: styles.bg, color: styles.text }}
            >
              {categoryLabel}
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
