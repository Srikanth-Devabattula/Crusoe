import type { Metadata } from "next";

import { SITE_NAME } from "@/constants";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  ogTitle,
} from "@/lib/seo";

export type PageMetadataOptions = {
  /** Site path for canonical URL, e.g. `/about` */
  path?: string;
  noIndex?: boolean;
  /** Relative path on this site or absolute URL for Open Graph / Twitter */
  ogImage?: string | null;
};

function resolveOgImage(ogImage?: string | null): string {
  if (ogImage?.trim()) return ogImage.trim();
  return DEFAULT_OG_IMAGE;
}

export function createPageMetadata(
  title: string,
  description: string,
  options?: PageMetadataOptions
): Metadata {
  const resolvedDescription = description.trim() || DEFAULT_DESCRIPTION;
  const image = resolveOgImage(options?.ogImage);
  const openGraphTitle = ogTitle(title);

  return {
    title,
    description: resolvedDescription,
    keywords: DEFAULT_KEYWORDS,
    alternates: options?.path ? { canonical: options.path } : undefined,
    openGraph: {
      title: openGraphTitle,
      description: resolvedDescription,
      url: options?.path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: image,
          alt: openGraphTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: resolvedDescription,
      images: [image],
    },
    robots: options?.noIndex ? { index: false, follow: false } : undefined,
  };
}
