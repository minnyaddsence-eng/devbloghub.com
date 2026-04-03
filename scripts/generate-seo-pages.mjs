import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolsPath = path.join(__dirname, "..", "data", "tools.json");
const out = path.join(__dirname, "..", "data", "seo-pages.json");

const USE_CASES = [
  "for-developers",
  "for-beginners",
  "for-debugging",
  "for-api-response-checks",
  "for-large-files",
  "for-documentation",
  "for-teaching",
  "for-seo-content-teams",
  "for-quick-one-off-tasks",
  "for-privacy-conscious-workflows",
];

const tools = JSON.parse(fs.readFileSync(toolsPath, "utf8"));
const pages = [];
for (const t of tools) {
  for (const keyword of t.seoSlugs) {
    for (const usecase of USE_CASES) {
      pages.push({ toolSlug: t.slug, keyword, usecase });
    }
  }
}
fs.writeFileSync(out, JSON.stringify(pages, null, 2));
console.log("Wrote", pages.length, "long-tail SEO rows");
