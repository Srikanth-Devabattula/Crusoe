import { SITE_NAME } from "@/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://crusoetec.com"
    : "http://localhost:3000");

export const FAVICON_PATH = "/images/global/favicon.png";

export const DEFAULT_OG_IMAGE = "/images/global/crusoe_logo.svg";

export const HOME_SEO_TITLE = "Crusoe | Onshape 3D CAD Engineering Services Experts";

export const DEFAULT_DESCRIPTION =
  "Crusoe provides Onshape 3D CAD engineering services, CAD software QA, platform migration, engineering design, and custom software development for global teams.";

export const HOME_SEO_DESCRIPTION =
  "Crusoe provides Onshape 3D CAD engineering services, CAD/CAM/CAE software testing, CAD platform migration, and engineering design support for software and manufacturing companies.";

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
