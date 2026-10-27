import { getWebsiteJsonLd } from "@/lib/seo";

/** Homepage WebSite schema — single JSON-LD block for the site entity */
export function WebsiteJsonLd() {
  const data = getWebsiteJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
