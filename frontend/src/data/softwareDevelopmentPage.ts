export const SOFTWARE_DEVELOPMENT_IMAGES = {
  hero: "/images/global/sehero.png",
  partnership: "/images/services/SE/se2.png",
} as const;

/** @deprecated Use SOFTWARE_DEVELOPMENT_IMAGES.hero */
export const SOFTWARE_DEVELOPMENT_PLACEHOLDER_IMAGE =
  SOFTWARE_DEVELOPMENT_IMAGES.hero;

export const softwareDevelopmentIntroLabels = [
  "Rev-Up Development",
  "Your Extended Team",
] as const;

export const softwareDevelopmentCtaBanner = {
  badge: "CAD Development",
  title: "Same expertise, quality consciousness & accountability",
  description:
    "Our contribution catalyzes your product development — like your in-house team, working from our office with complete confidentiality and value-added solutions.",
  highlights: [
    "Rapid product development",
    "Complete confidentiality",
    "Value-added solutions",
  ],
} as const;

export interface BenefitSegment {
  text: string;
  bold?: boolean;
}

export interface SoftwareDevelopmentBenefit {
  id: string;
  segments: BenefitSegment[];
}

export const softwareDevelopmentBenefits: SoftwareDevelopmentBenefit[] = [
  {
    id: "experienced",
    segments: [
      { text: "Experienced", bold: true },
      { text: " at developing & qualifying ", bold: false },
      { text: "CAD", bold: true },
      {
        text: " development platforms for industry leaders",
        bold: false,
      },
    ],
  },
  {
    id: "experts",
    segments: [
      { text: "Subject matter experts,", bold: true },
      {
        text: " who understands the techno-functional & domain aspects",
        bold: false,
      },
    ],
  },
  {
    id: "communication",
    segments: [
      { text: "Communication", bold: true },
      {
        text: " at equal levels, due to thorough understanding of the field",
        bold: false,
      },
    ],
  },
  {
    id: "focus",
    segments: [
      { text: "Helps", bold: true },
      { text: " you ", bold: false },
      { text: "focus", bold: true },
      {
        text: " on your core competencies and Innovations",
        bold: false,
      },
    ],
  },
  {
    id: "time",
    segments: [
      {
        text: "Substantially reduce time to develop the product",
        bold: true,
      },
    ],
  },
  {
    id: "cost",
    segments: [{ text: "Significant cost savings", bold: true }],
  },
];

export const softwareDevelopmentContentSections = [
  {
    heading: "Leverage our CAD expertise & rev-up your development",
    emphasis:
      "Rapid Product Development | Complete Confidentiality | Value-added Solutions",
    paragraphs: [
      "Our contribution catalyzes your product development — it's like your in-house team, working from our office.",
      "CAD development products are key to transforming ideas to innovation, and these products need to be enhanced constantly with bug-fixes, feature development, improved functionality, and collaboration tools that neutralize geographical boundaries.",
    ],
  },
  {
    heading: "The right partner for future-proof CAD products",
    paragraphs: [
      "Crusoe Technology is the right partner to work as an extended arm of your development team in making your product future-proof.",
      "With in-depth knowledge and hands-on experience of working with CAD development giants, we completely understand the challenges, plausible solutions and the work-culture — expertise, transparency, accountability and synergy between the two teams.",
    ],
  },
];

export const softwareDevelopmentPartnershipSection = {
  heading: "Extended development team with industry depth",
  paragraphs: [
    "We realize the importance of collaborative work culture that demands expertise, transparency, accountability and synergy between your team and ours.",
    "From FeatureScript tools to REST API apps and integrations — we bring the same rigor and quality consciousness you expect from an in-house engineering group.",
  ],
};

export interface SoftwareDevelopmentCapability {
  number: number;
  title: string;
  description: string;
}

export const softwareDevelopmentCapabilities: SoftwareDevelopmentCapability[] =
  [
    {
      number: 1,
      title: "FeatureScript Tools",
      description:
        "FeatureScript is the programming language designed for building 3D parametric models. We develop custom commands, geometry checkers, productivity tools, design automation and more.",
    },
    {
      number: 2,
      title: "REST API Apps & Integrations",
      description:
        "Client-specific apps on the App store and integrations between CAD platforms and other systems like PLM and ERP — built to your requirements.",
    },
  ];

/** @deprecated Use softwareDevelopmentContentSections */
export const softwareDevelopmentIntro = {
  lead: "Leverage Our Cad Expertise & Rev-Up Your Development",
  emphasis:
    "Rapid Product Development | Complete Confidentiality | Value-added Solutions",
  taglines: [
    "Our contribution catalyzes your Product Development;",
    "It's like your in-house team, working from our office;",
  ],
  heading: "SAME EXPERTISE, QUALITY CONSCIOUSNESS & ACCOUNTABILITY",
  paragraphs: softwareDevelopmentContentSections.flatMap((s) => s.paragraphs),
};
