import type { Metadata } from "next";
import Link from "next/link";
import { GlassPanel } from "@/components/GlassPanel";
import { BLOG_PAGE_SIZE, getBlogPageSlice, getSortedPosts } from "@/lib/blog";
import { absoluteOgImageUrl } from "@/lib/seo-config";
import { site } from "@/lib/site";

type Props = { searchParams: Promise<{ page?: string }> };

export const metadata: Metadata = {
  title: "Blog — tool guides & workflows",
  description: "Practical articles about JSON, encoding, SEO utilities, and developer productivity tools.",
  keywords: ["developer blog", "json", "seo tools", "workflows", "tutorials"],
  alternates: { canonical: `${site.url}/blog` },
  openGraph: {
    title: "DevBlogHubTools blog",
    description: "Guides and workflows for everyday developer tools.",
    url: `${site.url}/blog`,
    siteName: site.name,
    type: "website",
    images: [{ url: absoluteOgImageUrl(), width: 512, height: 512, alt: `${site.name} blog` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevBlogHubTools blog",
    description: "Guides and workflows for everyday developer tools.",
    images: [absoluteOgImageUrl()],
  },
  robots: { index: true, follow: true },
};

export default async function BlogIndexPage({ searchParams }: Props) {
  const { page: raw } = await searchParams;
  const parsed = Number.parseInt(raw ?? "1", 10);
  const pageNum = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  const { items, totalPages, page } = getBlogPageSlice(pageNum);
  const totalPosts = getSortedPosts().length;

  const makeHref = (p: number) => (p <= 1 ? "/blog" : `/blog?page=${p}`);

  return (
    <div className="mx-auto max-w-3xl min-w-0 px-3 py-8 sm:px-4 sm:py-12">
      <p className="text-sm font-medium text-sky-700 dark:text-cyan-300/80">Blog</p>
      <h1 className="mt-2 text-balance text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl dark:text-white">
        Guides for everyday tools
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        {totalPosts} article{totalPosts !== 1 ? "s" : ""}. {BLOG_PAGE_SIZE} per page.
      </p>

      <ul className="mt-10 list-none space-y-4 p-0">
        {items.map((post) => (
          <li key={post.slug}>
            <GlassPanel className="min-w-0 p-4 transition hover:border-sky-300/60 dark:hover:border-cyan-400/30 sm:p-6">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500">{post.date}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 block break-words text-lg font-semibold text-slate-900 hover:text-sky-700 sm:text-xl dark:text-white dark:hover:text-cyan-200"
              >
                {post.title}
              </Link>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{post.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </GlassPanel>
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <nav
          className="mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4"
          aria-label="Blog pagination"
        >
          <p className="order-first text-sm text-slate-600 dark:text-slate-400 sm:order-none sm:w-full sm:text-center">
            Page {page} of {totalPages}
          </p>
          <div className="flex w-full max-w-sm justify-center gap-3 sm:w-auto sm:max-w-none">
            {page > 1 ? (
              <Link
                href={makeHref(page - 1)}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-800 hover:bg-slate-50 sm:flex-initial sm:px-5 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-sm text-slate-400 sm:flex-initial sm:px-5 dark:text-slate-600">
                Previous
              </span>
            )}
            {page < totalPages ? (
              <Link
                href={makeHref(page + 1)}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-800 hover:bg-slate-50 sm:flex-initial sm:px-5 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-sm text-slate-400 sm:flex-initial sm:px-5 dark:text-slate-600">
                Next
              </span>
            )}
          </div>
        </nav>
      ) : null}

      <p className="mt-10 text-center text-sm text-slate-600 dark:text-slate-500">
        <Link href="/" className="text-sky-700 hover:underline dark:text-cyan-300/90">
          ← All tools
        </Link>
      </p>
    </div>
  );
}
