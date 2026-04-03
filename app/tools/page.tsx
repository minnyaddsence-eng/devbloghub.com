import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolGridClient } from "@/components/ToolGridClient";
import { getCategories, getTools } from "@/lib/tools";
import { absoluteOgImageUrl } from "@/lib/seo-config";
import { site } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All tools",
  description: `Full directory of ${getTools().length}+ free developer and SEO tools. Search, filter by category, no pagination.`,
  alternates: { canonical: `${site.url}/tools` },
  openGraph: {
    title: `All tools · ${site.name}`,
    description: "Search and filter the complete tool list.",
    url: `${site.url}/tools`,
    siteName: site.name,
    type: "website",
    images: [{ url: absoluteOgImageUrl(), width: 512, height: 512, alt: "All developer tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `All tools · ${site.name}`,
    description: "Search and filter the complete tool list.",
    images: [absoluteOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

function GridFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-400" aria-busy="true">
      Loading directory…
    </div>
  );
}

export default function AllToolsPage() {
  const tools = getTools();
  const categories = getCategories();

  return (
    <div className="min-w-0 pb-6 pt-6 sm:pb-8 sm:pt-8">
      <div className="mx-auto max-w-6xl min-w-0 px-3 sm:px-4">
        <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">Directory</p>
        <h1 className="mt-2 text-balance text-2xl font-bold text-white sm:text-3xl md:text-4xl">All tools</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Every utility on {site.name} in one place — {tools.length} tools, with search and category filters. On the{" "}
          <Link href="/" className="text-cyan-300/90 hover:text-cyan-200 hover:underline">
            homepage
          </Link>
          , see Top picks and Trending highlights.
        </p>
      </div>
      <section className="mt-8">
        <Suspense fallback={<GridFallback />}>
          <ToolGridClient tools={tools} categories={categories} basePath="/tools" paginate={false} />
        </Suspense>
      </section>
    </div>
  );
}
