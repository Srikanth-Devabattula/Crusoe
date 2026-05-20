"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { NewsCard } from "@/components/news/NewsCard";
import { NewsCategoryFilters, type NewsFilterCategory } from "@/components/news/NewsCategoryFilters";
import { NewsFeaturedHero } from "@/components/news/NewsFeaturedHero";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import { getApiErrorMessage } from "@/lib/api-error";
import { getFeaturedNews } from "@/lib/news";
import { newsService } from "@/services";
import type { News } from "@/types";

export function NewsListing() {
  const { categories, getLabel } = useNewsCategories();
  const [allItems, setAllItems] = useState<News[]>([]);
  const [activeCategory, setActiveCategory] = useState<NewsFilterCategory>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await newsService.getPublished();
      setAllItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setAllItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const featured = useMemo(() => getFeaturedNews(allItems), [allItems]);

  const showFeaturedHero = useMemo(
    () =>
      Boolean(
        featured && (activeCategory === "all" || featured.category === activeCategory)
      ),
    [featured, activeCategory]
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return allItems;
    return allItems.filter((item) => item.category === activeCategory);
  }, [allItems, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<NewsFilterCategory, number>> = { all: allItems.length };
    for (const item of allItems) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [allItems]);

  return (
    <>
      {showFeaturedHero && featured && !isLoading && (
        <NewsFeaturedHero item={featured} categoryLabel={getLabel(featured.category)} />
      )}

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="hero-container">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Latest updates
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Browse by category
            </h2>
          </div>

          <div className="mt-8">
            <NewsCategoryFilters
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
              counts={categoryCounts}
            />
          </div>

          {isLoading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 animate-pulse rounded-[20px] border border-gray-100 bg-gray-50" aria-hidden />
              ))}
            </div>
          ) : error ? (
            <p className="mt-12 rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
              {error}
            </p>
          ) : allItems.length === 0 ? (
            <p className="mt-12 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-slate-600">
              No news published yet. Check back soon.
            </p>
          ) : filteredItems.length === 0 ? (
            <p className="mt-12 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-slate-600">
              No news in this category yet.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <NewsCard key={item._id} item={item} categoryLabel={getLabel(item.category)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
