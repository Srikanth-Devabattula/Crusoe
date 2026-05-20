import type { BlogCategoryItem } from "@/types";

export function getCategoryLabel(
  slug: string,
  categories: BlogCategoryItem[]
): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
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
