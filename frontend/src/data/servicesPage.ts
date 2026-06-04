export const SERVICES_HERO_IMAGE = "/images/services-page/services-hero.png";
export const SERVICES_CTA_IMAGE = "/images/services-page/services-last.png";

export type ServiceAccent = "green" | "blue" | "purple" | "amber";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  accent: ServiceAccent;
  /** Card background */
  bgColor: string;
  /** Checkmarks, Learn More, arrow circle */
  accentColor: string;
}

export const servicesList: ServiceItem[] = [
  {
    id: "qa",
    title: "Quality Assurance",
    description:
      "Comprehensive QA services to ensure your software meets the highest standards of quality, reliability, and performance.",
    features: [
      "Manual Testing",
      "Test Strategy & Planning",
      "Regression Testing",
      "Performance Testing",
    ],
    image: "/images/services-page/service1.png",
    accent: "green",
    bgColor: "#F3F8EE",
    accentColor: "#7EA849",
  },
  {
    id: "automated-testing",
    title: "Automated Testing",
    description:
      "Accelerate releases with robust automation frameworks, CI/CD integration, and scalable test coverage across your stack.",
    features: [
      "Automation Framework",
      "API & Integration Testing",
      "CI/CD Integration",
      "Test Maintenance",
    ],
    image: "/images/services-page/service2.png",
    accent: "blue",
    bgColor: "#F3F7FC",
    accentColor: "#4A7DDB",
  },
  {
    id: "cad",
    title: "CAD Customisation",
    description:
      "Tailored CAD tools, workflow automation, and integrations that streamline engineering design and collaboration.",
    features: [
      "CAD Software Customization",
      "Plugin Development",
      "Process Automation",
      "Data Migration",
    ],
    image: "/images/services-page/service3.png",
    accent: "purple",
    bgColor: "#F5F0FB",
    accentColor: "#8B5CF6",
  },
  {
    id: "tooling",
    title: "Software Tooling",
    description:
      "Custom software tools and internal platforms that boost productivity, integration, and engineering velocity.",
    features: [
      "Custom Tools Development",
      "Plugin Development",
      "Workflow Automation",
      "System Integration",
    ],
    image: "/images/services-page/service4.png",
    accent: "amber",
    bgColor: "#FBF7EE",
    accentColor: "#D4A017",
  },
];

export const whyChooseServices = [
  {
    icon: "users" as const,
    title: "Expert Team",
    description: "Skilled engineers and QA specialists with deep domain expertise.",
  },
  {
    icon: "rocket" as const,
    title: "Faster Delivery",
    description: "Agile processes that accelerate time-to-market without compromise.",
  },
  {
    icon: "shield" as const,
    title: "Quality First",
    description: "Rigorous standards embedded in every engagement and deliverable.",
  },
  {
    icon: "lock" as const,
    title: "Secure & Compliant",
    description: "Enterprise-grade security and compliance built into our workflows.",
  },
  {
    icon: "chart" as const,
    title: "Scalable Solutions",
    description: "Architecture and practices that grow with your product and team.",
  },
  {
    icon: "headset" as const,
    title: "Trusted Partner",
    description: "Long-term collaboration focused on your success and innovation.",
  },
];
