import { BLOG_CATEGORY_LABELS } from "@/data/blogCategories";
import type { Blog, BlogCategory } from "@/types";

export function formatBlogCategory(category: BlogCategory): string {
  return BLOG_CATEGORY_LABELS[category] ?? category;
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

export function getFeaturedBlog(blogs: Blog[]): Blog | null {
  return blogs.find((b) => b.featured) ?? blogs[0] ?? null;
}

export function getBlogCoverStyle(category: BlogCategory) {
  const styles: Record<BlogCategory, string> = {
    technology: "from-[#4A7DDB]/20 via-[#F3F7FC] to-[#eef4e8]",
    engineering: "from-[#6DBB2D]/25 via-[#F3F8EE] to-[#eef4e8]",
    "company-news": "from-[#D4A017]/20 via-[#FBF7EE] to-[#eef4e8]",
    insights: "from-[#8B5CF6]/20 via-[#F5F0FB] to-[#eef4e8]",
    product: "from-[#0284c7]/20 via-[#F0F9FF] to-[#eef4e8]",
  };
  return styles[category] ?? styles.insights;
}
