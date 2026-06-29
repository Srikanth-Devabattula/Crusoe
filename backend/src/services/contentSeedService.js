const Testimonial = require("../models/Testimonial");
const TeamMember = require("../models/TeamMember");
const Partner = require("../models/Partner");

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

const seedContentIfEmpty = async () => {
  try {
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
  } catch (error) {
    console.error("Content seed failed:", error.message);
  }
};

module.exports = { seedContentIfEmpty };
