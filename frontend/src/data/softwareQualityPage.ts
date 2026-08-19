export const SOFTWARE_QUALITY_IMAGES = {
  hero: "/images/services/qahero.png",
} as const;

export const SOFTWARE_QUALITY_PLACEHOLDER_IMAGE = SOFTWARE_QUALITY_IMAGES.hero;

export const softwareQualityIntroLabels = [
  "Our Promise",
  "Make It Simple",
] as const;

export const softwareQualityAdvantageTagline =
  "We help you build Robust, Secure, Scalable product";

export const softwareQualityAdvantageItems = [
  "Consultative approach",
  "Covers every approach",
  "Meticulous test plans & execution",
  "Quick software turnaround",
  "Complete Process transparency",
  "Collaborative SmartSourcing Model",
  "Better Control over quality parameters",
  "Focus on core competencies",
  "Reduced time to market",
  "Insights from our Domain expertise",
  "Product Quality par Excellence",
  "Significant Cost Savings",
];

export const softwareQualityCtaBanner = {
  badge: "Quality & Security",
  title: "Software products are at their most vulnerable in today's digital world",
  description:
    "It is the shared responsibility of software companies and users to enforce rigorous quality and security checks — before vulnerabilities become costly failures.",
  highlights: [
    "End-to-end QA coverage",
    "Security-first validation",
    "Transparent, process-driven delivery",
  ],
} as const;

export interface SoftwareQualityTestingCard {
  number: number;
  title: string;
  description: string;
}

export const softwareQualityTestingCards: SoftwareQualityTestingCard[] = [
  {
    number: 1,
    title: "FUNCTIONAL",
    description:
      "Identifying and Reporting Bugs that nudge the software from performing desired behavior",
  },
  {
    number: 2,
    title: "REGRESSION",
    description:
      "Mitigating risks by ensuring that any code changes for future developments do not cause system failure",
  },
  {
    number: 3,
    title: "USABILITY",
    description:
      "Checking for any bugs in the user interface also including non-intuitive functionality",
  },
  {
    number: 4,
    title: "PERFORMANCE",
    description:
      "Spotting the bugs that hamper the performance of the software and hardware resources",
  },
  {
    number: 5,
    title: "MULTI PLATFORM & BROWSER",
    description:
      "Ensuring that the software works in an expected manner consistently across various platforms and browsers",
  },
  {
    number: 6,
    title: "AUTOMATION",
    description:
      "Test automation of your enterprise software to deliver quick and reliable results during aggressive timelines",
  },
  {
    number: 7,
    title: "MOBILE APPLICATIONS",
    description:
      "Covering entire gamut of tests and quality assurance parameters to ensure, secure, reliable and uninterrupted behavior of apps",
  },
  {
    number: 8,
    title: "SDLC",
    description:
      "360 Coverage of the entire software testing that allows you to focus on your core development, while ensure your product achieves excellence",
  },
];

export interface SoftwareQualityTestingTab {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
}

export const softwareQualityTestingTabs: SoftwareQualityTestingTab[] =
  softwareQualityTestingCards.map((card) => ({
    id: `testing-${card.number}`,
    label: card.title,
    title: card.title,
    description: card.description,
    image: SOFTWARE_QUALITY_IMAGES.hero,
  }));

export const softwareQualityContentSections = [
  {
    heading: "Business Knowledge | Strictly Process-Driven | 100% Reliability",
    emphasis:
      "Rapid Product Development | Complete Confidentiality | Value-added Solutions",
    paragraphs: [
      "Building a SOFTWARE PRODUCT is EASY; Building a GREAT & SUSTAINABLE one is tough.",
      "At Crusoe Technologies, we combine deep business knowledge with strictly process-driven QA — so every release meets the highest standards of reliability, not just on paper, but in production.",
      "Whether you need rapid product validation, complete confidentiality, or value-added testing insights, our consultative approach helps you ship faster while protecting brand reputation and customer trust.",
    ],
  },
  {
    heading: "WE HELP YOU TO MAKE IT SIMPLE",
    paragraphs: [
      "In the modern tech world, everyday we witness college students or young software developers developing a software or an application in a few weeks time, and within no time, it receives ridiculously high downloads.This is also true with enterprise software too. A young entrepreneur, who has spent a few years in a Fortune 500 company, developing his/her own enterprise software product.",
      "Some of the prime concerns of enterprises is to identify tangible benefits of engaging into a Third Party QA Service, control issues and affordability of such a service. Having worked in large software MNCs across the world, we understand that such companies have in-house capabilities to understand and execute quality strategies in a seemingly better-controlled manner.",
    ],
  },
];
