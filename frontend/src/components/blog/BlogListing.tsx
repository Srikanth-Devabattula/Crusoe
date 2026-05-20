"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { BlogCard } from "@/components/blog/BlogCard";
import {
  BlogCategoryFilters,
  type BlogFilterCategory,
} from "@/components/blog/BlogCategoryFilters";
import { BlogFeaturedHero } from "@/components/blog/BlogFeaturedHero";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { getApiErrorMessage } from "@/lib/api-error";
import { getFeaturedBlog } from "@/lib/blog";
import { blogService } from "@/services";
import type { Blog } from "@/types";

export function BlogListing() {
  const { categories, getLabel } = useBlogCategories();
  const [allPosts, setAllPosts] = useState<Blog[]>([]);
  const [activeCategory, setActiveCategory] = useState<BlogFilterCategory>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await blogService.getPublished();
      setAllPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setAllPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const featured = useMemo(() => getFeaturedBlog(allPosts), [allPosts]);

  const showFeaturedHero = useMemo(
    () =>
      Boolean(
        featured &&
          (activeCategory === "all" || featured.category === activeCategory)
      ),
    [featured, activeCategory]
  );

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return allPosts;
    return allPosts.filter((p) => p.category === activeCategory);
  }, [allPosts, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<BlogFilterCategory, number>> = { all: allPosts.length };
    for (const post of allPosts) {
      counts[post.category] = (counts[post.category] ?? 0) + 1;
    }
    return counts;
  }, [allPosts]);

  return (
    <>
      {showFeaturedHero && featured && !isLoading && (
        <BlogFeaturedHero
          post={featured}
          categoryLabel={getLabel(featured.category)}
        />
      )}

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="hero-container">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
                Latest articles
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Browse by category
              </h2>
            </div>
          </div>

          <div className="mt-8">
            <BlogCategoryFilters
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
              counts={categoryCounts}
            />
          </div>

          {isLoading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-80 animate-pulse rounded-[20px] border border-gray-100 bg-gray-50"
                  aria-hidden
                />
              ))}
            </div>
          ) : error ? (
            <p className="mt-12 rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
              {error}
            </p>
          ) : allPosts.length === 0 ? (
            <p className="mt-12 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-slate-600">
              No articles published yet. Check back soon.
            </p>
          ) : filteredPosts.length === 0 ? (
            <p className="mt-12 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-slate-600">
              No posts in this category yet.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  categoryLabel={getLabel(post.category)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
