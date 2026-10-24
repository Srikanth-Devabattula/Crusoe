const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.join(__dirname, "..");
const migrationPath = path.join(
  root,
  "prisma/migrations/20261007140000_init/migration.sql"
);
const outPath = path.join(root, "prisma/godaddy-hosted-import.sql");

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function stripComments(text) {
  return text.replace(/^\s*--[^\n]*\n/gm, "");
}

function mariaDbSafeColumns(text) {
  return text.replace(
    /((?:TEXT|LONGTEXT|TINYTEXT|MEDIUMTEXT)(?: NOT NULL)?) DEFAULT '(?:''|[^'])*'/g,
    "$1"
  );
}

function simplifyForHostedParser(text) {
  return text
    .replace(/\bBOOLEAN\b/g, "TINYINT(1)")
    .replace(/\bINTEGER\b/g, "INT")
    .replace(/\bJSON\b/g, "LONGTEXT")
    .replace(/DATETIME\(3\)/g, "DATETIME")
    .replace(/CURRENT_TIMESTAMP\(3\)/g, "CURRENT_TIMESTAMP")
    .replace(/\bfalse\b/g, "0")
    .replace(/\btrue\b/g, "1");
}

function splitStatements(sql) {
  return sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `${s};`);
}

const migrationRaw = fs.readFileSync(migrationPath, "utf8");
let body = normalizeNewlines(migrationRaw);
body = stripComments(body);
body = mariaDbSafeColumns(body);
body = simplifyForHostedParser(body);

const checksum = crypto
  .createHash("sha256")
  .update(fs.readFileSync(migrationPath))
  .digest("hex");
const migId = crypto.randomUUID();

const prismaMigrations = `
CREATE TABLE \`_prisma_migrations\` (
    \`id\` VARCHAR(36) NOT NULL,
    \`checksum\` VARCHAR(64) NOT NULL,
    \`finished_at\` DATETIME NULL,
    \`migration_name\` VARCHAR(255) NOT NULL,
    \`logs\` TEXT NULL,
    \`rolled_back_at\` DATETIME NULL,
    \`started_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`applied_steps_count\` INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;

const migrationRow = `
INSERT INTO \`_prisma_migrations\` (\`id\`, \`checksum\`, \`finished_at\`, \`migration_name\`, \`logs\`, \`rolled_back_at\`, \`started_at\`, \`applied_steps_count\`)
VALUES ('${migId}', '${checksum}', CURRENT_TIMESTAMP, '20261007140000_init', NULL, NULL, CURRENT_TIMESTAMP, 1)`;

const statements = [
  ...splitStatements(prismaMigrations),
  ...splitStatements(body),
  ...splitStatements(migrationRow),
];

const out = `${statements.join("\n\n")}\n`;

fs.writeFileSync(outPath, out, { encoding: "utf8" });

const badCr = /\r/.test(out);
const badGlue = /;\s*CREATE/i.test(out.replace(/;\n\nCREATE/g, ""));
const textDefaults = /(?:TEXT|LONGTEXT)(?: NOT NULL)? DEFAULT/i.test(out);

if (badCr || badGlue || textDefaults) {
  console.warn("Sanity check:", { badCr, badGlue, textDefaults });
} else {
  console.log("Sanity checks passed (LF only, statements separated).");
}
console.log(`Wrote ${statements.length} statements to ${outPath}`);
