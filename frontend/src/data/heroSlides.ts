import { ROUTES } from "@/constants";

export const HERO_BG_IMAGE = "/images/hero/herobg.png";

export interface HeroSlideView {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Full card background artwork */
  background: string;
  icon: string;
  ctaLink?: string;
}

/** Fallback slides when API is unavailable */
export const HERO_SLIDES: HeroSlideView[] = [
  {
    id: "fallback-1",
    number: "01",
    title: "Engineering Services",
    description:
      "Expert CAD platform migration, engineering solutions, and custom design services tailored for modern industries.",
    background: "/images/hero/card2.png",
    icon: "/images/hero/card2icon.png",
    ctaLink: ROUTES.servicesEngineering,
  },
  {
    id: "fallback-2",
    number: "02",
    title: "CAD/CAM/CAE Testing",
    description:
      "Specialized CAD validation and testing services designed to improve design accuracy, workflow efficiency and manufacturing quality.",
    background: "/images/hero/card1.png",
    icon: "/images/hero/card1icon.png",
    ctaLink: ROUTES.servicesCadCam,
  },
  {
    id: "fallback-3",
    number: "03",
    title: "Software Quality Assurance",
    description:
      "Comprehensive quality assurance and automated testing services to ensure reliability, performance and seamless user experiences.",
    background: "/images/hero/card1.png",
    icon: "/images/hero/card1icon.png",
    ctaLink: ROUTES.servicesQuality,
  },
  {
    id: "fallback-4",
    number: "04",
    title: "Software Development",
    description:
      "Building modern MCAD tools, scalable applications, and REST API solutions using advanced technologies and best practices.",
    background: "/images/hero/card3.png",
    icon: "/images/hero/card3icon.png",
    ctaLink: ROUTES.servicesDevelopment,
  },
  {
    id: "fallback-5",
    number: "05",
    title: "SmartSourcing",
    description:
      "SmartSourcing at Crusoe Technologies — global talent, rigorous quality, and on-time delivery for your engineering and software goals.",
    background: "/images/hero/card1.png",
    icon: "/images/hero/card1icon.png",
    ctaLink: ROUTES.smartsourcing,
  },
];

export const TRUSTED_COMPANIES = [
  "Hexagon",
  "Siemens",
  "Autodesk",
  "Ansys",
  "Dassault Systèmes",
] as const;
