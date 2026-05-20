import type { CategoryStyle } from "@/data/blogCategories";

export const KNOWN_NEWS_CATEGORY_STYLES: Record<string, CategoryStyle> = {
  announcements: { bg: "#FBF7EE", text: "#5c4a12", accent: "#D4A017" },
  "press-release": { bg: "#F3F7FC", text: "#1e3a5f", accent: "#4A7DDB" },
  "company-update": { bg: "#F3F8EE", text: "#2d4a1c", accent: "#6DBB2D" },
  events: { bg: "#F5F0FB", text: "#4c1d95", accent: "#8B5CF6" },
  industry: { bg: "#F0F9FF", text: "#0c4a6e", accent: "#0284c7" },
};

const FALLBACK_STYLES: CategoryStyle[] = [
  { bg: "#FFF7ED", text: "#7c2d12", accent: "#ea580c" },
  { bg: "#ECFDF5", text: "#064e3b", accent: "#059669" },
  { bg: "#FDF2F8", text: "#831843", accent: "#db2777" },
  { bg: "#F8FAFC", text: "#334155", accent: "#64748b" },
];

function hashSlug(slug: string): number {
  return slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getNewsCategoryStyle(slug: string): CategoryStyle {
  if (KNOWN_NEWS_CATEGORY_STYLES[slug]) return KNOWN_NEWS_CATEGORY_STYLES[slug];
  return FALLBACK_STYLES[hashSlug(slug) % FALLBACK_STYLES.length];
}
