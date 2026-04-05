import { generateSitemaps } from "@/app/sitemap";
import { site } from "@/lib/site";

/**
 * Sitemap index XML. Served at /sitemap.xml via `next.config` rewrite.
 * Next.js omits the root index when `generateSitemaps()` is used (only /sitemap/N.xml).
 * @see https://github.com/vercel/next.js/issues/77304
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const maps = await generateSitemaps();
  const locs = maps.map(({ id }) => `${site.url}/sitemap/${id}.xml`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map((loc) => `  <sitemap><loc>${escapeXml(loc)}</loc></sitemap>`).join("\n")}
</sitemapindex>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
