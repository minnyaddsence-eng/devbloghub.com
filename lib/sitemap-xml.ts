import type { SitemapEntry } from "@/lib/sitemap-data";

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatW3CDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Google urlset sitemap body (no XML declaration). */
export function buildUrlsetXml(entries: SitemapEntry[]): string {
  const inner = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${formatW3CDate(e.lastModified)}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${inner}
</urlset>`;
}

export function buildSitemapDocumentUrlset(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
${buildUrlsetXml(entries)}
`;
}
