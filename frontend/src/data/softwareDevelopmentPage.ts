export const SOFTWARE_DEVELOPMENT_PLACEHOLDER_IMAGE =
  "/images/services-page/service4.png";

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

export interface SoftwareDevelopmentCapability {
  id: string;
  title: string;
  description: string;
  fullWidth?: boolean;
}

export const softwareDevelopmentCapabilities: SoftwareDevelopmentCapability[] =
  [
    {
      id: "featurescript",
      title: "Onshape FeatureScript based Tools",
      description:
        "FeatureScript is the new programming language designed by Onshape for building and working with 3D Parametric models. Our team has the capability to develop custom commands, geometry checkers, productivity enhancement tools, design automation tools and more using FeatureScript Language.",
    },
    {
      id: "rest-api",
      title: "Onshape REST API Apps & Integrations",
      description:
        "Crusoe team has the capabilities to develop client specific Apps on the Onshape App store and can develop necessary integrations between Onshape to other systems like PLM, ERP etc based on the client requirements.",
    },
    {
      id: "component-libraries",
      title: "Component Libraries in Onshape",
      description:
        "Crusoe team can develop custom component libraries for clients similar to Standard Content library in Onshape. Onshape Standard Content library was developed by Crusoe team using FeatureScript language and created geometries based on the standard like ANSI, ISO etc",
      fullWidth: true,
    },
  ];

export const softwareDevelopmentIntro = {
  lead: "Leverage Our Cad Expertise & Rev-Up Your Development",
  emphasis:
    "Rapid Product Development | Complete Confidentiality | Value-added Solutions",
  taglines: [
    "Our contribution catalyzes your Product Development;",
    "It's like your in-house team, working from our office;",
  ],
  heading: "SAME EXPERTISE, QUALITY CONSCIOUSNESS & ACCOUNTABILITY",
  paragraphs: [
    "CAD development products are key to transforming ideas to innovation, and these products need to be enhanced constantly with bug-fixes, feature development, improved functionality, simplifying usability, collaboration tools, platform-independence, neutralizing geographical boundaries, and a lot more.",
    "Crusoe Technology is the right partner to work as an extended-arm of your development team in making your product future-proof. With in-depth knowledge and hands-on experience of working with CAD development giants, we completely understand the challenges, plausible solutions and the work-culture. We realize the importance of collaborative work culture that demands expertise, transparency, accountability and synergy between the two teams.",
  ],
};
