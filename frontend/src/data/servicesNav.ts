import { ROUTES } from "@/constants";

export interface ServiceNavChild {
  label: string;
  href: string;
}

export interface ServiceNavItem {
  id: string;
  label: string;
  href?: string;
  children?: ServiceNavChild[];
}

export const servicesNavItems: ServiceNavItem[] = [
  {
    id: "software-qa",
    label: "Software QA",
    children: [
      {
        label: "CAD CAM CAE Software Testing",
        href: ROUTES.servicesCadCam,
      },
      {
        label: "Software Quality",
        href: ROUTES.servicesQuality,
      },
    ],
  },
  {
    id: "engineering-services",
    label: "Engineering Services",
    href: ROUTES.servicesEngineering,
  },
  {
    id: "software-development",
    label: "Software Development",
    href: ROUTES.servicesDevelopment,
  },
];
