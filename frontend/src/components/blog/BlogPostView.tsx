"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi";

import { ArticleRichContent } from "@/components/common/ArticleRichContent";
import { PostGallery, PostVideo } from "@/components/common/PostMediaSection";
import { BlogCard } from "@/components/blog/BlogCard";
import { getCategoryStyle } from "@/data/blogCategories";
import { ROUTES } from "@/constants";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { estimateReadTime, formatBlogDate, getBlogDisplayDate } from "@/lib/blog";
import { getApiErrorMessage } from "@/lib/api-error";
import { getBlogGalleryUrls } from "@/lib/uploads";
import { getPostVideoUrls } from "@/lib/video";
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
  const galleryImages = getBlogGalleryUrls(post);
  const videoUrls = getPostVideoUrls(post);

  return (
    <article className="overflow-x-hidden bg-white" dir="ltr">
      <div className="relative overflow-hidden bg-transparent pt-[5.25rem] sm:pt-[5.75rem] lg:pt-[6.25rem]">
        <div className="hero-container min-w-0 pb-10 lg:pb-14">
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

          <h1 className="mt-4 max-w-4xl break-words text-left text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 max-w-3xl break-words text-left text-lg leading-relaxed text-slate-600">
            {post.excerpt}
          </p>

          <ul className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <HiOutlineCalendar className="h-4 w-4 text-brand" aria-hidden />
              {formatBlogDate(getBlogDisplayDate(post))}
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineClock className="h-4 w-4 text-brand" aria-hidden />
              {readTime} min read
            </li>
          </ul>
        </div>
      </div>

      <PostGallery images={galleryImages} title={post.title} />

      <div className="hero-container min-w-0 pt-10 lg:pt-12">
        <div className="prose-blog w-full max-w-none">
          <ArticleRichContent content={post.content} />
        </div>
      </div>

      <PostVideo title={post.title} videoUrls={videoUrls} />

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
