import { SITE_NAME } from "@/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://crusoetec.com"
    : "http://localhost:3000");

/** Google Search Console HTML tag (public in page source; env overrides for other environments) */
const GOOGLE_SITE_VERIFICATION_TOKEN =
  "4j80TGzsCv74SR8j0DBcPdAdrFr3zvEbLzD2za2q2xc";

export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION?.trim() ||
  GOOGLE_SITE_VERIFICATION_TOKEN;

export const FAVICON_PATH = "/images/global/favicon.png";

export const DEFAULT_OG_IMAGE = "/images/global/crusoe_logo.svg";

/** Full homepage `<title>` — use with `title.absolute` on `/` */
export const HOME_SEO_TITLE =
  "Crusoe Technologies | Onshape 3D CAD Engineering Services Experts";

/** Open Graph / JSON-LD site name (legal / search branding) */
export const SITE_OG_NAME = "Crusoe Technologies";

export const HOME_SEO_DESCRIPTION =
  "Crusoe Technologies delivers Onshape 3D CAD engineering services, CAD/CAM/CAE software testing, CAD platform migration, and custom software development for global software and manufacturing teams.";

export const DEFAULT_DESCRIPTION = HOME_SEO_DESCRIPTION;

export const DEFAULT_KEYWORDS = [
  "Crusoe Tech",
  "Crusoe Technologies",
  "Onshape",
  "3D CAD engineering services",
  "Onshape engineering services",
  "software testing",
  "CAD CAM CAE testing",
  "software quality assurance",
  "engineering services",
  "software development",
  "Visakhapatnam",
  "Hyderabad",
];

export function plainTextExcerpt(text: string, maxLength = 160): string {
  const plain = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 1).trim()}…`;
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

export function ogTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_NAME}`;
}

export type WebsiteJsonLd = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: typeof SITE_OG_NAME;
  alternateName: string;
  url: string;
};

export function getWebsiteJsonLd(): WebsiteJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_OG_NAME,
    alternateName: "Crusoe",
    url: absoluteUrl("/"),
  };
}
