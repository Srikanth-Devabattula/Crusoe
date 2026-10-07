const Testimonial = require("../models/Testimonial");
const TeamMember = require("../models/TeamMember");
const Partner = require("../models/Partner");
const HeroSlide = require("../models/HeroSlide");
const BlogCategory = require("../models/BlogCategory");
const NewsCategory = require("../models/NewsCategory");
const { DEFAULT_CATEGORIES: DEFAULT_BLOG_CATEGORIES } = require("../models/BlogCategory");
const { DEFAULT_CATEGORIES: DEFAULT_NEWS_CATEGORIES } = require("../models/NewsCategory");

const DEFAULT_TESTIMONIALS = [
  {
    name: "Adam Groszek",
    title: "Aerospace Engineer & Engineering Manager",
    company: "",
    quote:
      "I was amazed how well Crusoe performed in creating parametric CAD model of a midsize drone without prior involvement in the design process. We were afraid that without understanding of design nuances and being located on a different continent, Crusoe would require a lot of guidance and many hours on Teams. However, Crusoe's expertise in Onshape made the task execution very smooth. Well done, thank you.",
    photo: "/images/testimonials/default.jpeg",
    rating: 5,
    type: "text",
    published: true,
    sortOrder: 1,
  },
  {
    name: "David Katzman",
    title: "General Manager - Velocity Group, PTC Inc",
    company: "PTC Inc",
    quote:
      "Crusoe Technologies has proven to be an outstanding and trusted partner whose deep technical knowledge and industry expertise have been instrumental in not only advancing Onshape's software capabilities but also in empowering our customers to deliver exceptional products.",
    photo: "/images/testimonials/david-katzman.png",
    rating: 5,
    type: "text",
    published: true,
    sortOrder: 2,
  },
  {
    name: "Jake Ramsley",
    title: "Senior Director - QA & Release Manager, PTC Inc",
    company: "PTC Inc",
    quote:
      'Crusoe has been a great partner for Onshape through the years. Their industry knowledge, attention to detail, diligence and dedication to making a great product helps us deliver an unprecedented CAD experience where often customers say "It just works". Crusoe is and will continue to be a trusted voice in our development and release process.',
    photo: "/images/testimonials/jake-ramsley.png",
    rating: 5,
    type: "text",
    published: true,
    sortOrder: 3,
  },
  {
    name: "Penko Slivov",
    title: "Lead Senior Engineer, Juniper",
    company: "Juniper",
    quote:
      "Working with Crusoe has been an exceptional experience for Juniper, particularly in developing configurable assemblies in Onshape. Their team's expertise, professionalism, and commitment to quality have exceeded our expectations. We highly recommend Crusoe for their exemplary service and dedication to delivering outstanding results.",
    photo: "/images/testimonials/default.jpeg",
    rating: 5,
    type: "text",
    published: true,
    sortOrder: 4,
  },
  {
    name: "Michael Johnson",
    title: "Engineering Director",
    company: "Ansys",
    quote: "",
    photo: "",
    rating: 5,
    type: "video",
    videoUrl: "",
    published: true,
    sortOrder: 5,
  },
  {
    name: "Sarah Chen",
    title: "VP Product",
    company: "Dassault Systèmes",
    quote: "",
    photo: "",
    rating: 5,
    type: "video",
    videoUrl: "",
    published: true,
    sortOrder: 6,
  },
  {
    name: "Robert Taylor",
    title: "CTO",
    company: "Siemens",
    quote: "",
    photo: "",
    rating: 5,
    type: "video",
    videoUrl: "",
    published: true,
    sortOrder: 7,
  },
];

const DEFAULT_TEAM = [
  {
    name: "Arun Kumar",
    role: "Founder & CEO",
    bio: "Leads strategy and client partnerships with a focus on engineering excellence and sustainable growth.",
    photo: "/images/aboutus/team/team1.jpg",
    email: "info@crusoetec.com",
    published: true,
    sortOrder: 1,
  },
  {
    name: "Priya Nair",
    role: "Engineering Director",
    bio: "Drives architecture, delivery practices, and high-performing engineering teams across engagements.",
    photo: "/images/aboutus/team/team2.avif",
    email: "info@crusoetec.com",
    published: true,
    sortOrder: 2,
  },
  {
    name: "Vikram Reddy",
    role: "QA & Automation Lead",
    bio: "Specialises in test automation, quality frameworks, and reliable release pipelines.",
    photo: "/images/aboutus/team/team3.avif",
    email: "info@crusoetec.com",
    published: true,
    sortOrder: 3,
  },
  {
    name: "Neha Sharma",
    role: "Product Consultant",
    bio: "Bridges business goals and technical execution for customer-centric product outcomes.",
    photo: "/images/aboutus/team/team4.jpg",
    email: "info@crusoetec.com",
    published: true,
    sortOrder: 4,
  },
];

const DEFAULT_PARTNERS = [
  {
    name: "Juniper",
    logo: "/icons/logo1.png",
    websiteUrl: "",
    published: true,
    sortOrder: 1,
  },
  {
    name: "PTC",
    logo: "/icons/logo2.png",
    websiteUrl: "",
    published: true,
    sortOrder: 2,
  },
  {
    name: "Onshape",
    logo: "/icons/logo3.png",
    websiteUrl: "",
    published: true,
    sortOrder: 3,
  },
  {
    name: "Spokbee",
    logo: "/icons/logo4.png",
    websiteUrl: "",
    published: true,
    sortOrder: 4,
  },
  {
    name: "Garrett",
    logo: "/icons/logo5.png",
    websiteUrl: "",
    published: true,
    sortOrder: 5,
  },
];

const HERO_SLIDE_CTA_RULES = [
  [/^engineering services$/i, "/services/engineering-services"],
  [/cad.*cae.*testing|cad\/cam\/cae/i, "/services/cad-cam-cae-software-testing"],
  [/software quality|quality assurance$/i, "/services/software-quality"],
  [/^software development$/i, "/services/software-development"],
  [/smartsourcing/i, "/smartsourcing"],
];

const resolveHeroSlideCtaLink = (title, existing) => {
  const trimmed = String(existing ?? "").trim();
  if (trimmed) return trimmed;

  const normalizedTitle = String(title ?? "").trim();
  for (const [pattern, href] of HERO_SLIDE_CTA_RULES) {
    if (pattern.test(normalizedTitle)) return href;
  }
  return "";
};

const DEFAULT_HERO_SLIDES = [
  {
    title: "Engineering Services",
    description:
      "Expert CAD platform migration, engineering solutions, and custom design services tailored for modern industries.",
    image: "/images/hero/card2.png",
    icon: "/images/hero/card2icon.png",
    ctaLink: "/services/engineering-services",
    published: true,
    sortOrder: 1,
  },
  {
    title: "CAD/CAM/CAE Testing",
    description:
      "Specialized CAD validation and testing services designed to improve design accuracy, workflow efficiency and manufacturing quality.",
    image: "/images/hero/card1.png",
    icon: "/images/hero/card1icon.png",
    ctaLink: "/services/cad-cam-cae-software-testing",
    published: true,
    sortOrder: 2,
  },
  {
    title: "Software Quality Assurance",
    description:
      "Comprehensive quality assurance and automated testing services to ensure reliability, performance and seamless user experiences.",
    image: "/images/hero/card1.png",
    icon: "/images/hero/card1icon.png",
    ctaLink: "/services/software-quality",
    published: true,
    sortOrder: 3,
  },
  {
    title: "Software Development",
    description:
      "Building modern MCAD tools, scalable applications, and REST API solutions using advanced technologies and best practices.",
    image: "/images/hero/card3.png",
    icon: "/images/hero/card3icon.png",
    ctaLink: "/services/software-development",
    published: true,
    sortOrder: 4,
  },
  {
    title: "SmartSourcing",
    description:
      "SmartSourcing at Crusoe Technologies — global talent, rigorous quality, and on-time delivery for your engineering and software goals.",
    image: "/images/hero/card1.png",
    icon: "/images/hero/card1icon.png",
    ctaLink: "/smartsourcing",
    published: true,
    sortOrder: 5,
  },
];

const syncHeroSlideCtaLinks = async () => {
  const slides = await HeroSlide.find({});
  let updated = 0;

  for (const slide of slides) {
    if (String(slide.ctaLink ?? "").trim()) continue;

    const href = resolveHeroSlideCtaLink(slide.title, slide.ctaLink);
    if (!href) continue;

    slide.ctaLink = href;
    await slide.save();
    updated += 1;
  }

  if (updated > 0) {
    console.log(`Updated CTA links on ${updated} hero slide(s)`);
  }
};

const seedContentIfEmpty = async () => {
  try {
    const blogCategoryCount = await BlogCategory.countDocuments();
    if (blogCategoryCount === 0) {
      await BlogCategory.insertMany(DEFAULT_BLOG_CATEGORIES);
      console.log(`Seeded ${DEFAULT_BLOG_CATEGORIES.length} blog categories`);
    }

    const newsCategoryCount = await NewsCategory.countDocuments();
    if (newsCategoryCount === 0) {
      await NewsCategory.insertMany(DEFAULT_NEWS_CATEGORIES);
      console.log(`Seeded ${DEFAULT_NEWS_CATEGORIES.length} news categories`);
    }

    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
      console.log(`Seeded ${DEFAULT_TESTIMONIALS.length} testimonials`);
    }

    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      await TeamMember.insertMany(DEFAULT_TEAM);
      console.log(`Seeded ${DEFAULT_TEAM.length} team members`);
    }

    const partnerCount = await Partner.countDocuments();
    if (partnerCount === 0) {
      await Partner.insertMany(DEFAULT_PARTNERS);
      console.log(`Seeded ${DEFAULT_PARTNERS.length} partner logos`);
    }

    const heroSlideCount = await HeroSlide.countDocuments();
    if (heroSlideCount === 0) {
      await HeroSlide.insertMany(DEFAULT_HERO_SLIDES);
      console.log(`Seeded ${DEFAULT_HERO_SLIDES.length} hero slides`);
    }

    await syncHeroSlideCtaLinks();
  } catch (error) {
    console.error("Content seed failed:", error.message);
  }
};

module.exports = { seedContentIfEmpty };
