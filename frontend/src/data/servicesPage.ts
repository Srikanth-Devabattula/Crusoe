import { ROUTES } from "@/constants";

export const SERVICES_HERO_IMAGE = "/images/service/service1.png";
export const SERVICES_CTA_IMAGE = "/images/service/servicelast.png";

export type ServiceAccent = "green" | "blue" | "purple" | "amber";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  href: string;
  accent: ServiceAccent;
  /** Card background */
  bgColor: string;
  /** Checkmarks, Learn More, arrow circle */
  accentColor: string;
}

export const servicesList: ServiceItem[] = [
  {
    id: "engineering-services",
    title: "Engineering Services",
    description:
      "Advanced engineering solutions focused on product innovation, system optimization and scalable technology implementation for modern businesses.",
    features: [
      "Platform Migration & Integration",
      "Onshape Design Services",
      "CAD Content & Conceptual Designs",
      "Product Configurators",
    ],
    image: "/images/stock/st2.png",
    href: ROUTES.servicesEngineering,
    accent: "blue",
    bgColor: "#F3F7FC",
    accentColor: "#4A7DDB",
  },
  {
    id: "cad-testing",
    title: "CAD/CAM/CAE Testing",
    description:
      "Specialized CAD validation and testing services designed to improve design accuracy, workflow efficiency and manufacturing quality.",
    features: [
      "CAD/CAM/CAE Functional Testing",
      "Multi-platform & Browser Testing",
      "Mobile & Custom Testing",
      "CAD / PDM / PLM Validation",
    ],
    image: "/images/service/Cad.png",
    href: ROUTES.servicesCadCam,
    accent: "purple",
    bgColor: "#F5F0FB",
    accentColor: "#8B5CF6",
  },
  {
    id: "software-qa",
    title: "Software Quality Assurance",
    description:
      "Comprehensive quality assurance and automated testing services to ensure reliability, performance and seamless user experiences.",
    features: [
      "Functional & Regression Testing",
      "Test Strategy & Planning",
      "Performance & Automation",
      "Release Quality Assurance",
    ],
    image: "/images/stock/st7.png",
    href: ROUTES.servicesQuality,
    accent: "green",
    bgColor: "#F3F8EE",
    accentColor: "#7EA849",
  },
  {
    id: "software-development",
    title: "Software Development",
    description:
      "Custom software applications built with modern technologies to deliver secure, scalable and high-performance digital experiences.",
    features: [
      "Onshape FeatureScript Tools",
      "REST API Apps & Integrations",
      "Component Libraries",
      "Extended Development Teams",
    ],
    image: "/images/stock/st8.png",
    href: ROUTES.servicesDevelopment,
    accent: "amber",
    bgColor: "#FBF7EE",
    accentColor: "#D4A017",
  },
];

/** Home page card photos — services page keeps `servicesList` images above */
export const homeServicesCardImages: Record<string, string> = {
  "engineering-services": "/images/services/service1.png",
  "software-development": "/images/services/service2.png",
  "software-qa": "/images/services/service3.png",
  "cad-testing": "/images/services/service4.png",
};

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
