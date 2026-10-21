const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..", "..");
const publicDir = path.join(__dirname, "..", "public");

const SCAN_DIRS = [
  path.join(repoRoot, "frontend", "src"),
  path.join(repoRoot, "frontend"),
  path.join(repoRoot, "backend", "src"),
];

const SCAN_EXT = /\.(tsx?|jsx?|css|json|mjs)$/i;
const SKIP = new Set(["node_modules", ".next", "dist", "public"]);

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc);
    else if (SCAN_EXT.test(ent.name)) acc.push(p);
  }
  return acc;
}

function walkPublic(dir, base = "", acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkPublic(p, rel, acc);
    else acc.push("/" + rel.replace(/\\/g, "/"));
  }
  return acc;
}

let corpus = "";
for (const root of SCAN_DIRS) {
  for (const file of walkFiles(root)) {
    if (file.includes(`${path.sep}scripts${path.sep}`)) continue;
    corpus += fs.readFileSync(file, "utf8") + "\n";
  }
}

const publicFiles = walkPublic(publicDir);
const unused = [];
const missing = new Set(
  [...corpus.matchAll(/\/(?:images|icons)\/[A-Za-z0-9_./-]+/g)].map((m) => m[0]),
);

for (const web of publicFiles) {
  if (!corpus.includes(web)) unused.push(web);
}

for (const ref of missing) {
  const disk = path.join(publicDir, ref.slice(1));
  if (!fs.existsSync(disk)) {
    console.log("MISSING (referenced but not on disk):", ref);
  }
}

if (unused.length) {
  console.log("UNUSED on disk:");
  unused.forEach((u) => console.log(" ", u));
  process.exit(1);
}

console.log("OK:", publicFiles.length, "public files; all referenced in source.");
