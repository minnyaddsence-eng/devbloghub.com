import { getSitemapEntriesForShardId, listSitemapShardIds } from "@/lib/sitemap-data";
import { buildSitemapDocumentUrlset } from "@/lib/sitemap-xml";
import { sitemapChunkCacheControl } from "@/src/app/seo/revalidate";

type Props = { params: Promise<{ file: string }> };

/**
 * Chunked urlsets only — no `app/sitemap.ts` metadata pipeline (avoids Next ISR on sitemap shards).
 * Public URL: `/sitemap/{n}.xml` via `next.config` rewrite.
 */
export async function GET(_req: Request, { params }: Props) {
  const { file } = await params;
  if (!/^\d+\.xml$/i.test(file)) {
    return new Response("Not Found", { status: 404 });
  }
  const shardId = Number.parseInt(file.replace(/\.xml$/i, ""), 10);
  if (!Number.isFinite(shardId) || shardId < 0) {
    return new Response("Not Found", { status: 404 });
  }

  const allowed = new Set(listSitemapShardIds().map((x) => x.id));
  if (!allowed.has(shardId)) {
    return new Response("Not Found", { status: 404 });
  }

  const entries = getSitemapEntriesForShardId(shardId);
  const body = buildSitemapDocumentUrlset(entries);

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": sitemapChunkCacheControl(),
    },
  });
}
