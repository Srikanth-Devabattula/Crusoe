import type { BlogCategory } from "@/types";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "technology",
  "engineering",
  "company-news",
  "insights",
  "product",
];

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  technology: "Technology",
  engineering: "Engineering",
  "company-news": "Company News",
  insights: "Insights",
  product: "Product",
};

export const BLOG_CATEGORY_STYLES: Record<
  BlogCategory,
  { bg: string; text: string; accent: string }
> = {
  technology: { bg: "#F3F7FC", text: "#1e3a5f", accent: "#4A7DDB" },
  engineering: { bg: "#F3F8EE", text: "#2d4a1c", accent: "#6DBB2D" },
  "company-news": { bg: "#FBF7EE", text: "#5c4a12", accent: "#D4A017" },
  insights: { bg: "#F5F0FB", text: "#4c1d95", accent: "#8B5CF6" },
  product: { bg: "#F0F9FF", text: "#0c4a6e", accent: "#0284c7" },
};
