export type CategoryStyle = { bg: string; text: string; accent: string };

export const KNOWN_CATEGORY_STYLES: Record<string, CategoryStyle> = {
  technology: { bg: "#F3F7FC", text: "#1e3a5f", accent: "#4A7DDB" },
  engineering: { bg: "#F3F8EE", text: "#2d4a1c", accent: "#7EA849" },
  "company-news": { bg: "#FBF7EE", text: "#5c4a12", accent: "#D4A017" },
  insights: { bg: "#F5F0FB", text: "#4c1d95", accent: "#8B5CF6" },
  product: { bg: "#F0F9FF", text: "#0c4a6e", accent: "#0284c7" },
};

const FALLBACK_STYLES: CategoryStyle[] = [
  { bg: "#FDF2F8", text: "#831843", accent: "#db2777" },
  { bg: "#FFF7ED", text: "#7c2d12", accent: "#ea580c" },
  { bg: "#ECFDF5", text: "#064e3b", accent: "#059669" },
  { bg: "#FEF2F2", text: "#7f1d1d", accent: "#dc2626" },
  { bg: "#F8FAFC", text: "#334155", accent: "#64748b" },
];

function hashSlug(slug: string): number {
  return slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getCategoryStyle(slug: string): CategoryStyle {
  if (KNOWN_CATEGORY_STYLES[slug]) {
    return KNOWN_CATEGORY_STYLES[slug];
  }
  return FALLBACK_STYLES[hashSlug(slug) % FALLBACK_STYLES.length];
}

export function getBlogCoverGradient(slug: string): string {
  const style = getCategoryStyle(slug);
  return `from-[${style.accent}]/20 via-[${style.bg}] to-[#eef4e8]`;
}
