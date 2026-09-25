export const ENGINEERING_IMAGES = {
  hero: "/images/services/eng/eng1.png",
  migration: "/images/services/eng/eng2.png",
} as const;

export const engineeringIntroLabels = [
  "CAD Platform Migration",
  "Design Excellence",
] as const;

export const engineeringCtaBanner = {
  badge: "Engineering at Scale",
  title: "From migration to product configurators — engineered for continuity",
  description:
    "We orchestrate every element of your engineering workflow so new platforms perform at their best, with minimal disruption to your business.",
  highlights: [
    "Meticulous migration planning",
    "Onshape CAD expertise",
    "End-to-end design support",
  ],
} as const;

export const engineeringContentSections = [
  {
    heading: "Migration — smooth, meticulous & effective",
    emphasis: "Draw value from every unit of investment",
    paragraphs: [
      "CAD platform migration might seem overwhelming; we ensure it's smooth, and you draw value from every smallest unit of investment. We will be Meticulous, Thorough & Effective.",
      "Getting adjusted to a newer platform is one thing, but gaining expertise at it seems too optimistic. Not really! With a detailed plan in place, Crusoe helps you become productive in the shortest time.",
    ],
  },
  {
    heading: "Onshape CAD experts across every domain",
    paragraphs: [
      "Irrespective of the domain, our Onshape CAD experts can help you with complex 3D geometry creation, building complex parts/assembly configurations, and making complex release/production drawings.",
      "This is the expertise and technology competency we have gained over decades — helping you make complex engineering processes simple and effective.",
    ],
  },
];

export const engineeringMigrationSection = {
  heading: "Strategic CAD platform migration",
  paragraphs: [
    "We study and understand your current setup, chalk out a plan, identify the period of migration, manage relevant notifications, explain the process in detail to the stakeholders, migrate critical customer data from other CAD platforms, set up and migrate information from the existing PDM and PLM systems to the new platform, test the systems in a new environment, and ensure business continuity.",
    "This may seem simple as well as intricate at the same time. Our engineers perfectly orchestrate every single element, so that the new platform performs at its best.",
    "We adopt a strategic approach to the migration exercise, ensuring that all your ancillary, yet crucial, requirements are met.",
  ],
};

export interface EngineeringServiceCard {
  number: number;
  title: string;
  description: string;
}

export const engineeringServiceCards: EngineeringServiceCard[] = [
  {
    number: 1,
    title: "Engineering Design Services",
    description:
      "Complex 3D geometry creation, parts and assembly configurations, and release/production drawings — delivered by seasoned Onshape CAD specialists.",
  },
  {
    number: 2,
    title: "3D CAD Conceptual Designs",
    description:
      "Conceptual and reference designs for consumer and engineering products built in Onshape.",
  },
  {
    number: 3,
    title: "Product Configurators",
    description:
      "Parts and assembly configuration functionality in Onshape to build product configurators that showcase engineering products on digital platforms.",
  },
  {
    number: 4,
    title: "Component Libraries",
    description:
      "Custom component library, similar to Standard Content in Onshape based on ANSI, ISO and others Global Standards. Crusoe team has lot of expertise on Onshape's builtin Standard Content Library",
  },
];
