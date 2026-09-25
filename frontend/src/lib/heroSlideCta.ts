import { ROUTES } from "@/constants";

const HERO_SLIDE_CTA_RULES: { test: RegExp; href: string }[] = [
  { test: /^engineering services$/i, href: ROUTES.servicesEngineering },
  { test: /cad.*cae.*testing|cad\/cam\/cae/i, href: ROUTES.servicesCadCam },
  { test: /software quality|quality assurance$/i, href: ROUTES.servicesQuality },
  { test: /^software development$/i, href: ROUTES.servicesDevelopment },
  { test: /smartsourcing/i, href: ROUTES.smartsourcing },
];

/** Default CTA when slide title matches a known homepage hero topic. */
export function resolveHeroSlideCta(
  title: string,
  ctaLink?: string | null
): string {
  const trimmed = ctaLink?.trim();
  if (trimmed) return trimmed;

  const normalizedTitle = title.trim();
  for (const rule of HERO_SLIDE_CTA_RULES) {
    if (rule.test.test(normalizedTitle)) return rule.href;
  }

  return ROUTES.services;
}
