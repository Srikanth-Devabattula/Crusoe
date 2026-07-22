import { SITE_NAME } from "@/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://crusoetec.com"
    : "http://localhost:3000");

export const FAVICON_PATH = "/images/global/favicon.png";

export const DEFAULT_OG_IMAGE = "/images/global/crusoe_logo.svg";

export const DEFAULT_DESCRIPTION =
  "Crusoe Tech delivers software quality assurance, CAD/CAM/CAE testing, engineering services, and custom software development for reliable, high-impact solutions.";

export const DEFAULT_KEYWORDS = [
  "Crusoe Tech",
  "Crusoe Technologies",
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
