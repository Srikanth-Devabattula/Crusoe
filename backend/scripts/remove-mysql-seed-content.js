/**
 * Remove startup seed content from MySQL (Option B pre-import cleanup).
 * Preserves: local admin user (ADMIN_EMAIL), otps, schema, all MongoDB data untouched.
 *
 * Does NOT use TRUNCATE / DROP. Uses Prisma deleteMany on seed-only tables only.
 *
 * Usage: node scripts/remove-mysql-seed-content.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { prisma } = require("../src/lib/prisma");
const { getConfiguredAdminEmail } = require("../src/constants/envAdmin");

const COUNT_TABLES = [
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

async function printCounts(label) {
  console.log(`\n=== ${label} ===`);
  for (const [key, label] of COUNT_TABLES) {
    console.log(`${label}: ${await prisma[key].count()}`);
  }
}

async function main() {
  const adminEmail = getConfiguredAdminEmail();
  if (!adminEmail) {
    console.error("ADMIN_EMAIL must be set in .env");
    process.exit(1);
  }

  const adminUser = await prisma.user.findFirst({
    where: { email: adminEmail, role: "admin" },
  });

  if (!adminUser) {
    console.warn(
      `Warning: no admin user with email ${adminEmail} and role=admin found. Users table will not be modified.`
    );
  } else {
    console.log(`Preserving admin user id=${adminUser.id} email=${adminUser.email}`);
  }

  await printCounts("MySQL counts BEFORE cleanup");

  const dependents = {
    blogs: await prisma.blog.count(),
    news: await prisma.news.count(),
    jobs: await prisma.job.count(),
    applications: await prisma.application.count(),
    contacts: await prisma.contact.count(),
    storedFiles: await prisma.storedFile.count(),
  };

  if (Object.values(dependents).some((n) => n > 0)) {
    console.error(
      "Abort: expected blogs/news/jobs/applications/contacts/stored_files to be empty before seed cleanup.",
      dependents
    );
    process.exit(1);
  }

  const seedTables = [
    ["blogCategory", "blog_categories"],
    ["newsCategory", "news_categories"],
    ["testimonial", "testimonials"],
    ["teamMember", "team_members"],
    ["partner", "partners"],
    ["heroSlide", "hero_slides"],
  ];

  console.log("\n=== Deleting seed-only rows (deleteMany) ===");
  for (const [model, name] of seedTables) {
    const result = await prisma[model].deleteMany({});
    console.log(`${name}: deleted ${result.count} row(s)`);
  }

  const userCount = await prisma.user.count();
  if (adminUser && userCount !== 1) {
    console.warn(`Users table has ${userCount} row(s); expected 1 admin after cleanup.`);
  }

  await printCounts("MySQL counts AFTER cleanup");
  console.log("\nCleanup complete. Do not run db:migrate-data until approved.\n");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
