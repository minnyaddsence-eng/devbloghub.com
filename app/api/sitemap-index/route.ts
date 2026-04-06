import { listSitemapShardIds } from "@/lib/sitemap-data";
import { site } from "@/lib/site";
import { sitemapIndexCacheControl } from "@/src/app/seo/revalidate";

/**
 * Sitemap index XML. Served at `/sitemap.xml` via `next.config` rewrite.
 * Child urlsets: `/sitemap/{n}.xml` → `/api/sitemap-chunk/{n}.xml` (no metadata `app/sitemap.ts`).
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const maps = listSitemapShardIds();
  const locs = maps.map(({ id }) => `${site.url}/sitemap/${id}.xml`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map((loc) => `  <sitemap><loc>${escapeXml(loc)}</loc></sitemap>`).join("\n")}
</sitemapindex>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": sitemapIndexCacheControl(),
    },
  });
}
