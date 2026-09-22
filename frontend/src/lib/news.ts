import { plainTextFromHtml } from "@/lib/htmlContent";
import { getPublishDisplayDate, sortByPublishDate, type DateSort } from "@/lib/publishDate";

export function estimateNewsReadTime(content: string): number {
  const words = plainTextFromHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getFeaturedNews<T extends { featured: boolean }>(items: T[]): T | null {
  return items.find((item) => item.featured) ?? null;
}

export function getNewsDisplayDate(item: {
  publishedAt?: string | null;
  createdAt: string;
}): string {
  return getPublishDisplayDate(item);
}

export type NewsDateSort = DateSort;

export const sortNewsByDate = sortByPublishDate;
