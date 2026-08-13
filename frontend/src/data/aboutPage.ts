export const ABOUT_HERO_IMAGE = "/images/aboutus/about1.png";
export const ABOUT_STORY_IMAGE = "/images/aboutus/about2.png";
export const ABOUT_CTA_IMAGE = "/images/aboutus/about7.png";

export const cultureImages = [
  "/images/aboutus/about3.png",
  "/images/aboutus/about5.png",
  "/images/aboutus/about6.png",
  "/images/aboutus/about4.png",
] as const;

export const storyParagraphs = [
  "Founded in 2015, Crusoe Technologies began with a clear mission: help businesses build better software with engineering discipline and quality at the core.",
  "Over the years we have grown into a trusted partner for QA automation, CAD customisation, software tooling, and full-cycle engineering services — serving startups and global enterprises alike.",
  "Today we combine deep technical expertise with agile delivery to ship scalable, secure solutions that accelerate innovation and long-term product success.",
] as const;

export const missionVision = [
  {
    icon: "target" as const,
    title: "Our Mission",
    description:
      "Deliver scalable and high-quality engineering solutions that empower businesses to innovate faster.",
    href: "#our-story",
  },
  {
    icon: "eye" as const,
    title: "Our Vision",
    description:
      "Become a globally trusted technology partner known for innovation, reliability, and engineering excellence.",
    href: "#core-values",
  },
] as const;

export const leadershipTeam = [
  {
    name: "Arun Kumar",
    role: "Founder & CEO",
    image: "/images/aboutus/team/team1.jpg",
    bio: "Leads strategy and client partnerships with a focus on engineering excellence and sustainable growth.",
  },
  {
    name: "Priya Nair",
    role: "Engineering Director",
    image: "/images/aboutus/team/team2.avif",
    bio: "Drives architecture, delivery practices, and high-performing engineering teams across engagements.",
  },
  {
    name: "Vikram Reddy",
    role: "QA & Automation Lead",
    image: "/images/aboutus/team/team3.avif",
    bio: "Specialises in test automation, quality frameworks, and reliable release pipelines.",
  },
  {
    name: "Neha Sharma",
    role: "Product Consultant",
    image: "/images/aboutus/team/team4.jpg",
    bio: "Bridges business goals and technical execution for customer-centric product outcomes.",
  },
] as const;

export const coreValues = [
  {
    icon: "zap" as const,
    title: "Innovation",
    description: "We explore modern tools and methods to solve complex engineering challenges.",
  },
  {
    icon: "shield" as const,
    title: "Quality First",
    description: "Rigorous standards and testing are embedded in every delivery.",
  },
  {
    icon: "check" as const,
    title: "Transparency",
    description: "Clear communication and honest progress reporting build lasting trust.",
  },
  {
    icon: "users" as const,
    title: "Collaboration",
    description: "We work as an extension of your team with shared ownership of outcomes.",
  },
  {
    icon: "award" as const,
    title: "Security",
    description: "Enterprise-grade practices protect your data, IP, and compliance needs.",
  },
  {
    icon: "trending" as const,
    title: "Customer Success",
    description: "Your long-term success is the measure we care about most.",
  },
] as const;

export const timelineMilestones = [
  {
    year: "2015",
    title: "Company Founded",
    description:
      "Crusoe Technologies (formerly Everglades Technologies) launched with a focus on software quality and engineering services.",
    icon: "rocket" as const,
  },
  {
    year: "2019",
    title: "Visakhapatnam Headquarters",
    description: "Started operations at Visakhapatnam as Head Quarters.",
    icon: "globe" as const,
  },
  {
    year: "2022",
    title: "Hyderabad Operations",
    description: "Started operations at Gachibowli, Hyderabad.",
    icon: "shield" as const,
  },
  {
    year: "2022",
    title: "Engineering Services",
    description: "Started offering Engineering Services to our Clients.",
    icon: "cpu" as const,
  },
  {
    year: "2024",
    title: "CAD Software Development",
    description: "Started CAD Software Development Services.",
    icon: "trending" as const,
  },
  {
    year: "2026",
    title: "Global MNC Partnerships",
    description: "Partners to 9+ MNCs in 9+ Countries.",
    icon: "zap" as const,
  },
] as const;

export const cultureFeatures = [
  "Collaborative Environment",
  "Agile Mindset",
  "Continuous Learning",
  "Global Opportunities",
] as const;

export const statsStrip = [
  { icon: "users" as const, value: 150, suffix: "+", label: "Happy Clients" },
  { icon: "trending" as const, value: 300, suffix: "+", label: "Projects Delivered" },
  { icon: "globe" as const, value: 25, suffix: "+", label: "Countries Served" },
  { icon: "award" as const, value: 10, suffix: "+", label: "Years Experience" },
] as const;
