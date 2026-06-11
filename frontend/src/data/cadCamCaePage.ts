import { ROUTES } from "@/constants";

export const CAD_CAM_PLACEHOLDER_IMAGE = "/images/services-page/service1.png";

export const cadCamAdvantageLinks = [
  { label: "Software Quality", href: ROUTES.servicesQuality },
  { label: "Engineering Services", href: ROUTES.servicesEngineering },
  { label: "Software Development", href: ROUTES.servicesDevelopment },
];

export const cadCamEnsuresItems = [
  "Quick",
  "Highest quality standards",
  "Reliability",
  "Transparency",
  "Control",
];

export interface CadCamGamutTab {
  id: string;
  label: string;
  title: string;
  items: string[];
}

export const cadCamGamutTabs: CadCamGamutTab[] = [
  {
    id: "new-projects",
    label: "New projects",
    title: "We conduct end-to-end QA for your 3D Design Software",
    items: [
      "UI & UX Testing",
      "Functional testing",
      "Integration testing",
      "System testing of new functionalities and enhancements",
    ],
  },
  {
    id: "release-testing",
    label: "Release Testing",
    title:
      "A systematic, process-driven approach with distinct phases and timelines",
    items: [
      "Regression testing",
      "Performance testing",
      "Multi-platform testing",
      "Multi-browser testing",
      "Globalization testing",
      "Graphics testing",
    ],
  },
  {
    id: "mobile-testing",
    label: "Mobile Testing",
    title:
      "We employ 3D design app testing thoroughly on smartphones so that your product works smoothly on them",
    items: [
      "Comprehensive testing on iOS and Android Platforms",
      "Ensure full CAD, PDM, PLM functionalities are supported on these platforms",
    ],
  },
  {
    id: "custom-testing",
    label: "Custom Testing",
    title: "Customized QA Services to ensure full portability",
    items: [
      "Testing of apps on App Stores",
      "Peripherals testing",
      "Integration testing of 3D mouse, Stylus etc with the software",
    ],
  },
];

export const cadCamIntroSections = [
  {
    heading:
      "We test your ENGINEERING DESIGN SOFTWARE across the entire spectrum of Software Development Life Cycle",
    paragraphs: [
      "Testing and ensuring top-notch quality of an engineering design software can be extremely overwhelming. A thorough quality process needs to be followed in a regimental modus to ensure an air-tight product. We understand that because we have been on the development side of some of the most popular and rich 3D design software companies.",
      "Having led large Quality Assurance teams across diverse geographies, it's our sincere belief that augmenting your incumbent QA department with an external partner, or collaborating with a QA partner exponentially enhances the quality of your product and significantly reduces the time to market.",
    ],
  },
  {
    heading: "QUALITY ENGINEERING",
    paragraphs: [
      "We have been working on products such as Solidworks, Onshape, and others that facilitate rapid development of products. Therefore, we visualize beyond what's seen, and hence are able to also identify probable causes of the error. This value-addition is one of the greatest highlights of our Quality Assurance Process. Based on this vast experience, we have built a Product Excellence framework that encompasses the entire 3D Design Software Life Cycle.",
    ],
    emphasis: "Accelerate your development",
  },
];
