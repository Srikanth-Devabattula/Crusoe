require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { prisma } = require("../src/lib/prisma");

const tables = [
  ["user", "users"],
  ["oTP", "otps"],
  ["blogCategory", "blog_categories"],
  ["blog", "blogs"],
  ["newsCategory", "news_categories"],
  ["news", "news"],
  ["job", "jobs"],
  ["application", "applications"],
  ["contact", "contacts"],
  ["testimonial", "testimonials"],
  ["teamMember", "team_members"],
  ["partner", "partners"],
  ["heroSlide", "hero_slides"],
  ["storedFile", "stored_files"],
];

(async () => {
  for (const [key, label] of tables) {
    console.log(`${label}: ${await prisma[key].count()}`);
  }
  await prisma.$disconnect();
})();
