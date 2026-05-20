"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi";

import { BlogCard } from "@/components/blog/BlogCard";
import { CoverImage } from "@/components/common/CoverImage";
import { getCategoryStyle } from "@/data/blogCategories";
import { ROUTES } from "@/constants";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { estimateReadTime, formatBlogDate } from "@/lib/blog";
import { getApiErrorMessage } from "@/lib/api-error";
import { getBlogCoverUrl } from "@/lib/uploads";
import { blogService } from "@/services";
import type { Blog } from "@/types";

interface BlogPostViewProps {
  slug: string;
}

export function BlogPostView({ slug }: BlogPostViewProps) {
  const { getLabel } = useBlogCategories();
  const [post, setPost] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [postRes, allRes] = await Promise.all([
        blogService.getBySlug(slug),
        blogService.getPublished(),
      ]);
      const current = postRes.data ?? null;
      setPost(current);

      const all = Array.isArray(allRes.data) ? allRes.data : [];
      setRelated(
        all
          .filter((b) => b.slug !== slug && b.category === current?.category)
          .slice(0, 3)
      );
      if (!current) setError("Article not found");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (isLoading) {
    return (
      <div className="hero-container animate-pulse py-12">
        <div className="h-8 w-48 rounded bg-gray-100" />
        <div className="mt-6 h-12 max-w-2xl rounded bg-gray-100" />
        <div className="mt-8 h-64 rounded-2xl bg-gray-50" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="hero-container py-12">
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-sm text-red-700">
          {error ?? "This article could not be found."}
        </p>
        <Link
          href={ROUTES.blog}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to blog
        </Link>
      </div>
    );
  }

  const styles = getCategoryStyle(post.category);
  const readTime = estimateReadTime(post.content);
  const coverSrc = getBlogCoverUrl(post.coverImage);

  return (
    <article className="bg-white">
      <div className="relative overflow-hidden bg-[#eef4e8] pt-[5.25rem] sm:pt-[5.75rem] lg:pt-[6.25rem]">
        <div className="hero-container pb-10 lg:pb-14">
          <Link
            href={ROUTES.blog}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand"
          >
            <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
            All articles
          </Link>

          <span
            className="mt-6 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: styles.bg, color: styles.text }}
          >
            {getLabel(post.category)}
          </span>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
            {post.excerpt}
          </p>

          <ul className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <HiOutlineCalendar className="h-4 w-4 text-brand" aria-hidden />
              {formatBlogDate(post.createdAt)}
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineClock className="h-4 w-4 text-brand" aria-hidden />
              {readTime} min read
            </li>
          </ul>
        </div>
      </div>

      <div className="hero-container pb-12 lg:pb-16">
        <figure className="mx-auto max-w-3xl overflow-hidden rounded-[20px] border border-[#E8EEF5] bg-slate-50/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          {coverSrc ? (
            <CoverImage
              src={coverSrc}
              alt=""
              width={960}
              height={540}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              imageClassName="mx-auto block h-auto w-full max-h-[280px] object-contain sm:max-h-[320px] lg:max-h-[360px]"
            />
          ) : (
            <div
              className="aspect-[16/10] w-full max-h-[240px] sm:max-h-[280px]"
              style={{
                background: `linear-gradient(to bottom right, ${styles.accent}33, ${styles.bg}, #eef4e8)`,
              }}
            />
          )}
        </figure>

        <div className="prose-blog mx-auto mt-10 max-w-3xl">
          {post.content.split("\n").map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className="mb-5 text-base leading-relaxed text-slate-700 sm:text-lg">
                {paragraph}
              </p>
            ) : (
              <br key={index} />
            )
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-[#E8EEF5] bg-[#f8faf6] py-14 sm:py-16">
          <div className="hero-container">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Related articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard
                  key={item._id}
                  post={item}
                  categoryLabel={getLabel(item.category)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
