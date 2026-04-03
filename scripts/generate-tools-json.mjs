import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "data", "tools.json");

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** @type {string[]} */
const extra = [
  "JSON Minifier",
  "Text Reverse",
  "Line Sort Dedupe",
  "Email Extractor",
  "Duplicate Line Remover",
  "Whitespace Trimmer",
  "Find Replace Batch",
  "ASCII Border",
  "Number Base Converter",
  "Binary Decimal Converter",
  "IP Subnet Calculator",
  "User-Agent Parser",
  "MIME Type Lookup",
  "HTTP Status Lookup",
  "Markdown Table Generator",
  "JSON Path Tester",
  "SQL Formatter Lite",
  "GraphQL Formatter",
  "API Key Generator",
  "HMAC Helper",
  "PEM Decoder",
  "CSR Parser",
  "ULID Generator",
  "NanoID Generator",
  "OTP Generator",
  "TOTP QR Builder",
  "Password Strength Meter",
  "Environment Var Escaper",
  "Dotenv Parser",
  "TOML to JSON",
  "EditorConfig Generator",
  "Gitignore Merger",
  "Semver Calculator",
  "Changelog Formatter",
  "Branch Name Slugger",
  "README TOC Generator",
  "Badge Generator",
  "Robots Rule Builder",
  "Canonical URL Builder",
  "Hreflang Tag Builder",
  "JSON-LD FAQ Builder",
  "Breadcrumb JSON-LD",
  "Organization Schema Helper",
  "Article Schema Helper",
  "Product Schema Helper",
  "Event Schema Helper",
  "Recipe Schema Helper",
  "Local Business Schema",
  "Sitemap XML Formatter",
  "Content-Type Builder",
  "Cache-Control Builder",
  "Security.txt Builder",
  "Humans.txt Builder",
  "Ads.txt Line Checker",
  "App Ads.txt Checker",
  "Slug Collision Checker",
  "Meta Title Length Checker",
  "Meta Description Preview",
  "Open Graph Tag Builder",
  "Twitter Card Builder",
  "Schema Validator Text",
  "RSS Item Counter",
  "Atom Feed Formatter",
  "Cron Next Runs",
  "Epoch Batch Convert",
  "Color Palette Steps",
  "Contrast Ratio Quick",
  "Gradient CSS Builder",
  "Box Shadow Generator",
  "Flexbox Cheat Sheet",
  "Grid Cheat Sheet",
  "Tailwind Class Merger",
  "SVG Path Minifier",
  "SVG ViewBox Calculator",
  "Image Srcset Generator",
  "Responsive Breakpoint Helper",
  "Font Stack Formatter",
  "Line Height Converter",
  "Rem Px Calculator",
  "Viewport Units Calculator",
  "ARIA Role Lookup",
  "Focus Order Helper",
  "Keyboard Shortcut Formatter",
  "Dockerfile Linter Text",
  "Compose Validator Text",
  "K8s Label Validator",
  "Helm Values Merger",
  "NPM Semver Range Explain",
  "PNPM Workspace Snippet",
  "Bun Script Snippet",
  "Vite Env Prefix Helper",
  "Webpack Public Path Helper",
  "ESM CJS Export Mapper",
  "Import Sort Helper",
  "Bundle Size Estimator Text",
];

const categories = ["Formatters", "Encoders", "Generators", "Text", "Security", "Web", "Dev", "Data", "SEO", "Meta"];

/** @type {{ name: string; slug: string; category: string; description: string }[]} */
const tools = [
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    category: "Formatters",
    description: "Beautify, validate, and minify JSON in the browser.",
  },
  {
    name: "JSON Validator",
    slug: "json-validator",
    category: "Formatters",
    description: "Check JSON syntax and highlight errors locally.",
  },
  {
    name: "Base64 Encode/Decode",
    slug: "base64",
    category: "Encoders",
    description: "Encode or decode Base64 strings without uploading data.",
  },
  {
    name: "URL Encoder/Decoder",
    slug: "url-encode",
    category: "Encoders",
    description: "Encode or decode URL components safely.",
  },
  {
    name: "UUID Generator",
    slug: "uuid-generator",
    category: "Generators",
    description: "Generate RFC-4122 v4 UUIDs instantly.",
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    category: "Security",
    description: "Create strong passwords with custom rules.",
  },
  {
    name: "Word Counter",
    slug: "word-counter",
    category: "Text",
    description: "Count words, characters, lines, and reading time.",
  },
  {
    name: "Case Converter",
    slug: "case-converter",
    category: "Text",
    description: "Convert text between camelCase, snake_case, Title Case, and more.",
  },
  {
    name: "Slug Generator",
    slug: "slug-generator",
    category: "Text",
    description: "Turn headlines into clean URL slugs.",
  },
  {
    name: "Timestamp Converter",
    slug: "timestamp-converter",
    category: "Dev",
    description: "Convert Unix seconds/ms to human-readable dates and back.",
  },
  {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    category: "Security",
    description: "Decode JWT headers and payloads (signature not verified).",
  },
  {
    name: "HTML Minifier",
    slug: "html-minifier",
    category: "Formatters",
    description: "Minify HTML snippets for smaller payloads.",
  },
  {
    name: "CSS Minifier",
    slug: "css-minifier",
    category: "Formatters",
    description: "Strip whitespace and comments from CSS.",
  },
  {
    name: "JS Minifier",
    slug: "js-minifier",
    category: "Formatters",
    description: "Lightweight JS minify for small scripts.",
  },
  {
    name: "Regex Tester",
    slug: "regex-tester",
    category: "Dev",
    description: "Test regular expressions with live matches.",
  },
  {
    name: "Color Converter",
    slug: "color-converter",
    category: "Dev",
    description: "Convert HEX/RGB/HSL and copy values quickly.",
  },
  {
    name: "Markdown Preview",
    slug: "markdown-preview",
    category: "Text",
    description: "Preview Markdown as HTML in the browser.",
  },
  {
    name: "Text Diff",
    slug: "text-diff",
    category: "Text",
    description: "Compare two texts and see line-level differences.",
  },
  {
    name: "Random Number Generator",
    slug: "random-number",
    category: "Generators",
    description: "Generate random integers in a range.",
  },
  {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum",
    category: "Generators",
    description: "Generate placeholder paragraphs and words.",
  },
  {
    name: "Hash Generator",
    slug: "hash-generator",
    category: "Security",
      description: "Compute SHA-256 digests of text (Web Crypto).",
  },
  {
    name: "CSV to JSON",
    slug: "csv-to-json",
    category: "Data",
    description: "Convert simple CSV tables to JSON arrays.",
  },
  {
    name: "JSON to CSV",
    slug: "json-to-csv",
    category: "Data",
    description: "Flatten JSON objects to CSV for spreadsheets.",
  },
  {
    name: "Query String Parser",
    slug: "query-string-parser",
    category: "Web",
    description: "Parse and build URL query strings.",
  },
  {
    name: "HTML Entities",
    slug: "html-entities",
    category: "Encoders",
    description: "Encode and decode HTML entities.",
  },
  {
    name: "ROT13",
    slug: "rot13",
    category: "Encoders",
    description: "Apply ROT13 cipher for obfuscation demos.",
  },
  {
    name: "Hex Encode/Decode",
    slug: "hex-encode",
    category: "Encoders",
    description: "Convert text to hexadecimal and back.",
  },
  {
    name: "XML Formatter",
    slug: "xml-formatter",
    category: "Formatters",
    description: "Pretty-print XML with basic indentation.",
  },
  {
    name: "YAML to JSON",
    slug: "yaml-to-json",
    category: "Formatters",
    description: "Convert YAML-like structures to JSON using a forgiving parser.",
  },
  {
    name: "Cron Explainer",
    slug: "cron-explainer",
    category: "Dev",
    description: "Describe common cron expressions in plain language.",
  },
];

let n = tools.length;
for (const title of extra) {
  if (n >= 100) break;
  const slug = `${slugify(title)}-${n}`;
  tools.push({
    name: title,
    slug,
    category: categories[n % categories.length],
    description: `Client-side ${title.toLowerCase()} — runs locally in your browser for speed and privacy.`,
  });
  n++;
}

const kw = (name, slug) => {
  const s = slug.replace(/-\d+$/, "").replace(/-/g, " ");
  return [`${s} online`, `free ${s}`, `${name.toLowerCase()} tool`, `browser ${s}`, `${s} no signup`];
};

const seoSlugsFor = (slug, name) => {
  const base = [
    `${slug}-online`,
    `free-${slug}`,
    `${slug}-tool`,
    `${slug}-browser`,
    `best-${slug}`,
    `${slug}-no-upload`,
    `${slug}-instant`,
    `${slug}-developer`,
    `${slug}-web-app`,
    `${slugify(name)}-utility`,
  ];
  return [...new Set(base.map((s) => slugify(s)))];
};

const payload = tools.map((t) => ({
  name: t.name,
  slug: t.slug,
  description: t.description,
  category: t.category,
  keywords: kw(t.name, t.slug),
  faq: [
    {
      q: `Is the ${t.name} tool free to use?`,
      a: `Yes. ${t.name} on DevBlogHub is free for typical usage and processes data locally in your browser when possible.`,
    },
    {
      q: "Do you upload my input to your servers?",
      a: "These tools are built for client-side workflows. You should still avoid pasting highly sensitive secrets into any website.",
    },
    {
      q: "Will this work on mobile?",
      a: "The interface is responsive and works on modern mobile browsers.",
    },
  ],
  seoSlugs: seoSlugsFor(t.slug, t.name),
}));

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(payload, null, 2));
console.log("Wrote", payload.length, "tools to", out);
