"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";

import { PostGallery, PostVideo } from "@/components/common/PostMediaSection";
import { NewsCard } from "@/components/news/NewsCard";
import { getNewsCategoryStyle } from "@/data/newsCategories";
import { ROUTES } from "@/constants";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import { getApiErrorMessage } from "@/lib/api-error";
import { estimateNewsReadTime, formatNewsDate, getNewsDisplayDate } from "@/lib/news";
import { getNewsGalleryUrls } from "@/lib/uploads";
import { getPostVideoUrls } from "@/lib/video";
import { newsService } from "@/services";
import type { News } from "@/types";

interface NewsArticleViewProps {
  slug: string;
}

export function NewsArticleView({ slug }: NewsArticleViewProps) {
  const { getLabel } = useNewsCategories();
  const [item, setItem] = useState<News | null>(null);
  const [related, setRelated] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItem = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [itemRes, allRes] = await Promise.all([
        newsService.getBySlug(slug),
        newsService.getPublished(),
      ]);
      const current = itemRes.data ?? null;
      setItem(current);
      const all = Array.isArray(allRes.data) ? allRes.data : [];
      setRelated(
        all.filter((n) => n.slug !== slug && n.category === current?.category).slice(0, 3)
      );
      if (!current) setError("News article not found");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setItem(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  if (isLoading) {
    return (
      <div className="hero-container animate-pulse py-12">
        <div className="h-8 w-48 rounded bg-gray-100" />
        <div className="mt-6 h-12 max-w-2xl rounded bg-gray-100" />
        <div className="mt-8 h-64 rounded-2xl bg-gray-50" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="hero-container py-12">
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-sm text-red-700">
          {error ?? "This news article could not be found."}
        </p>
        <Link
          href={ROUTES.blogNewsTab("news")}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to news
        </Link>
      </div>
    );
  }

  const styles = getNewsCategoryStyle(item.category);
  const readTime = estimateNewsReadTime(item.content);
  const galleryImages = getNewsGalleryUrls(item);
  const videoUrls = getPostVideoUrls(item);

  return (
    <article className="overflow-x-hidden bg-white">
      <div className="relative overflow-hidden bg-transparent pt-[5.25rem] sm:pt-[5.75rem] lg:pt-[6.25rem]">
        <div className="hero-container pb-10 lg:pb-14">
          <Link
            href={ROUTES.blogNewsTab("news")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand"
          >
            <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
            All news
          </Link>

          <span
            className="mt-6 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: styles.bg, color: styles.text }}
          >
            {getLabel(item.category)}
          </span>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{item.excerpt}</p>

          <ul className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <HiOutlineCalendar className="h-4 w-4 text-brand" aria-hidden />
              {formatNewsDate(getNewsDisplayDate(item))}
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineClock className="h-4 w-4 text-brand" aria-hidden />
              {readTime} min read
            </li>
          </ul>
        </div>
      </div>

      <PostGallery images={galleryImages} title={item.title} />

      <div className="hero-container min-w-0 pt-10 lg:pt-12">
        <div className="prose-blog mx-auto max-w-3xl">
          {item.content.split("\n").map((paragraph, index) =>
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

      <PostVideo title={item.title} videoUrls={videoUrls} />

      {related.length > 0 && (
        <section className="border-t border-[#E8EEF5] bg-[#f8faf6] py-14 sm:py-16">
          <div className="hero-container">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Related news</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedItem) => (
                <NewsCard
                  key={relatedItem._id}
                  item={relatedItem}
                  categoryLabel={getLabel(relatedItem.category)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
