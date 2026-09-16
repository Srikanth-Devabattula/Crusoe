export interface ServicePageData {
  slug: string;
  title: string;
  badge: string;
  headline: string;
  highlight: string;
  description: string;
  features: string[];
  offerings: string[];
}

export const servicePages: Record<string, ServicePageData> = {
  "cad-cam-cae-software-testing": {
    slug: "cad-cam-cae-software-testing",
    title: "CAD CAM CAE Software Testing",
    badge: "SOFTWARE QA",
    headline: "Precision Testing for",
    highlight: "CAD CAM CAE Platforms",
    description:
      "We test engineering design software across the entire software development life cycle — from UI and functional testing to release, mobile, and custom CAD/PDM/PLM quality assurance.",
    features: [
      "Functional & regression testing for CAD/CAM/CAE tools",
      "Geometry, modeling, and solver workflow validation",
      "Cross-platform and version compatibility testing",
      "Performance, stability, and load testing",
    ],
    offerings: [
      "Test strategy and coverage planning for engineering products",
      "Automated test suites for repeatable release cycles",
      "Defect triage with engineering-focused reporting",
      "Release sign-off support for enterprise deployments",
    ],
  },
  "software-quality": {
    slug: "software-quality",
    title: "Software Quality",
    badge: "SOFTWARE QA",
    headline: "Build Confidence with",
    highlight: "End-to-End Quality",
    description:
      "Crusoe helps you build robust, secure, scalable products through SmartSourcing, meticulous test plans, and a versatile SQA ecosystem across functional, regression, usability, and automation testing.",
    features: [
      "Manual and exploratory testing",
      "Test planning, estimation, and traceability",
      "Regression and smoke test execution",
      "Quality metrics and release readiness reviews",
    ],
    offerings: [
      "Dedicated QA teams aligned to your delivery cadence",
      "Shift-left quality practices with dev collaboration",
      "Risk-based testing for faster, safer releases",
      "Audit-ready documentation and reporting",
    ],
  },
  "engineering-services": {
    slug: "engineering-services",
    title: "Engineering Services",
    badge: "ENGINEERING",
    headline: "Accelerate Delivery with",
    highlight: "Expert Engineering",
    description:
      "Platform migration, Onshape design services, CAD conceptual designs, and product configurators — engineering expertise to help you migrate, design, and showcase products with confidence.",
    features: [
      "Product engineering and feature development",
      "API design, integrations, and modernization",
      "Workflow automation for engineering teams",
      "Technical documentation and handover support",
    ],
    offerings: [
      "Embedded engineers working as an extension of your team",
      "Architecture reviews and implementation support",
      "Legacy system enhancement and refactoring",
      "Scalable delivery models for long-term engagements",
    ],
  },
  "software-development": {
    slug: "software-development",
    title: "Software Development",
    badge: "DEVELOPMENT",
    headline: "Custom Software Built for",
    highlight: "Scale and Impact",
    description:
      "Leverage Crusoe CAD expertise for FeatureScript tools, REST API apps and integrations — an extended development team with same expertise and accountability.",
    features: [
      "Full-stack application development",
      "Cloud-native and microservices architecture",
      "UI/UX implementation for web and desktop",
      "CI/CD, DevOps, and deployment automation",
    ],
    offerings: [
      "MVP to production-grade product development",
      "Reusable component libraries and SDKs",
      "Third-party system and data integrations",
      "Ongoing enhancement and support services",
    ],
  },
};

export const servicePageSlugs = Object.keys(servicePages);

export function getServicePage(slug: string): ServicePageData | undefined {
  return servicePages[slug];
}
