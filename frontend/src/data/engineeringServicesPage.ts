import { ROUTES } from "@/constants";

export const ENGINEERING_PLACEHOLDER_IMAGE =
  "/images/services-page/service3.png";

export const engineeringRelatedLinks = [
  {
    label: "CAD CAM CAE Software Testing",
    href: ROUTES.servicesCadCam,
  },
  {
    label: "Software Quality",
    href: ROUTES.servicesQuality,
  },
  {
    label: "Software Development",
    href: ROUTES.servicesDevelopment,
  },
];

export interface EngineeringFeatureBlock {
  id: string;
  title: string;
  description: string;
  imagePosition: "left" | "right";
  extraParagraphs?: string[];
}

export const engineeringFeatureBlocks: EngineeringFeatureBlock[] = [
  {
    id: "migration",
    title: "Migration",
    description:
      "Platform Migration might seem overwhelming; we ensure it's smooth, and you draw value from every smallest unit of investment. We will be Meticulous, Thorough & Effective.",
    imagePosition: "left",
    extraParagraphs: [
      "Getting adjusted to a newer platform is one thing, but gaining expertise at it seems too optimistic. Not really! With a detailed plan in place, Crusoe helps you become productive in the shortest time.",
      "We study and understand your current setup, chalk out a plan, identify the period of migration, manage relevant notifications, explain the process in detail to the stakeholders, migrate critical customer data from other CAD platforms, set up and migrate information from the existing PDM and PLM systems to the new platform, test the systems in a new environment, and ensure business continuity.",
      "This may seem simple as well as intricate at the same time. It's the expertise and technology competency that we have gained over decades that helps us to make the process simple for you. Our engineers perfectly orchestrate every single element, so that the new platform performs at its best.",
      "We adopt a strategic approach to the migration exercise, ensuring that all your ancillary, yet crucial, requirements are met.",
    ],
  },
  {
    id: "design-services",
    title: "Design Services",
    description:
      "Irrespective of the domain, our Onshape CAD experts can help you with complex 3D Geometry creation, building complex Parts/Assembly Configurations, and making complex release/production drawings.",
    imagePosition: "right",
  },
  {
    id: "cad-content",
    title: "CAD Content and Conceptual Designs",
    description:
      "Crusoe's team has a lot of experience creating conceptual/reference designs of various consumer and engineering products. Crusoe's team has built a lot of conceptual designs for Onshape for sales and marketing purposes.",
    imagePosition: "left",
  },
  {
    id: "product-configurators",
    title: "Product Configurators",
    description:
      "Using Parts and Assemblies configuration functionality in Onshape, we build Product Configurators to showcase the engineering products on the Digital Platforms.",
    imagePosition: "right",
  },
];
