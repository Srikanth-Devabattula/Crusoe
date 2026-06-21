import { ROUTES } from "@/constants";

export interface RelatedServiceLink {
  label: string;
  href: string;
}

export const allServiceLinks: RelatedServiceLink[] = [
  {
    label: "CAD CAM CAE Software Testing",
    href: ROUTES.servicesCadCam,
  },
  {
    label: "Software Quality",
    href: ROUTES.servicesQuality,
  },
  {
    label: "Engineering Services",
    href: ROUTES.servicesEngineering,
  },
  {
    label: "Software Development",
    href: ROUTES.servicesDevelopment,
  },
];

export function getRelatedServiceLinks(currentHref: string): RelatedServiceLink[] {
  return allServiceLinks.filter((link) => link.href !== currentHref);
}
