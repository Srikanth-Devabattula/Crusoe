import { ROUTES } from "@/constants";

export const HERO_BG_IMAGE = "/images/hero/herobg.png";

export interface HeroSlide {
  id: number;
  number: string;
  title: string;
  description: string;
  /** Full card background artwork */
  background: string;
  icon: string;
  href: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    number: "01",
    title: "Quality Assurance",
    description:
      "Ensuring reliable, scalable, and high-quality software solutions through advanced QA processes and automation testing.",
    background: "/images/hero/card1.png",
    icon: "/images/hero/card1icon.png",
    href: ROUTES.services,
  },
  {
    id: 2,
    number: "02",
    title: "Engineering Services",
    description:
      "Expert CAD platform migration, engineering solutions, and custom design services tailored for modern industries.",
    background: "/images/hero/card2.png",
    icon: "/images/hero/card2icon.png",
    href: ROUTES.services,
  },
  {
    id: 3,
    number: "03",
    title: "Software Development",
    description:
      "Building modern MCAD tools, scalable applications, and REST API solutions using advanced technologies and best practices.",
    background: "/images/hero/card3.png",
    icon: "/images/hero/card3icon.png",
    href: ROUTES.services,
  },
];

export const TRUSTED_COMPANIES = [
  "Hexagon",
  "Siemens",
  "Autodesk",
  "Ansys",
  "Dassault Systèmes",
] as const;
