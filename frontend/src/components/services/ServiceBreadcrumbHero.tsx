import Link from "next/link";

import { ROUTES } from "@/constants";
import { PageHeroOverlay } from "@/components/common/PageHeroOverlay";

interface ServiceBreadcrumbHeroProps {
  title: string;
  crumbs: { label: string; href?: string }[];
}

export function ServiceBreadcrumbHero({
  title,
  crumbs,
}: ServiceBreadcrumbHeroProps) {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <PageHeroOverlay />

      <div className="hero-container relative z-10 pb-10 pt-[5.25rem] sm:pb-12 sm:pt-[5.75rem] lg:pb-14 lg:pt-[6.25rem]">
        <h1 className="text-heading text-[28px] leading-[1.12] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
          {title}
        </h1>

        <nav
          aria-label="Breadcrumb"
          className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600"
        >
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-slate-400" aria-hidden>
                  /
                </span>
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="font-medium transition-colors hover:text-brand"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-brand">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}

export const defaultServiceCrumbs = [
  { label: "Home", href: ROUTES.home },
  { label: "Service" },
];
