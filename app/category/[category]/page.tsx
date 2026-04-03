import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassPanel } from "@/components/GlassPanel";
import { site } from "@/lib/site";
import { getCategories, getToolsByCategory } from "@/lib/tools";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return getCategories().map((category) => ({
    category: encodeURIComponent(category),
  }));
}

function decodeParam(cat: string) {
  try {
    return decodeURIComponent(cat);
  } catch {
    return cat;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = decodeParam(category);
  const tools = getToolsByCategory(name);
  if (!tools.length) return {};
  const title = `${name} developer tools — ${site.name}`;
  const description = `Browse ${tools.length}+ ${name.toLowerCase()} utilities on ${site.domain}. Free, fast, client-first tools.`;
  const url = `${site.url}/category/${category}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const name = decodeParam(category);
  const tools = getToolsByCategory(name);
  if (!tools.length) notFound();

  return (
    <div className="mx-auto max-w-5xl min-w-0 px-3 py-8 sm:px-4 sm:py-12">
      <p className="text-sm text-cyan-300/80">Category</p>
      <h1 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl md:text-4xl">{name} tools</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        Explore utilities tagged as {name}. Each tool page includes structured FAQs, internal links, and static HTML for
        SEO.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="min-w-0">
            <GlassPanel className="h-full p-4 transition hover:border-cyan-400/40 hover:bg-white/[0.09] sm:p-5">
              <h2 className="break-words text-base font-semibold text-white sm:text-lg">{t.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{t.description}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-cyan-300/70">Open tool →</p>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </div>
  );
}
