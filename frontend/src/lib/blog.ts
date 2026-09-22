import type { BlogCategoryItem } from "@/types";
import { plainTextFromHtml } from "@/lib/htmlContent";
import { getPublishDisplayDate, sortByPublishDate, type DateSort } from "@/lib/publishDate";

export function getCategoryLabel(
  slug: string,
  categories: BlogCategoryItem[]
): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function estimateReadTime(content: string): number {
  const words = plainTextFromHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getFeaturedBlog<T extends { featured: boolean }>(
  blogs: T[]
): T | null {
  return blogs.find((b) => b.featured) ?? null;
}

export function getBlogDisplayDate(post: {
  publishedAt?: string | null;
  createdAt: string;
}): string {
  return getPublishDisplayDate(post);
}

export type BlogDateSort = DateSort;

export const sortBlogsByDate = sortByPublishDate;
