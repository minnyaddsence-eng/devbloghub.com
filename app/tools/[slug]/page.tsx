import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolArticle } from "@/components/ToolArticle";
import { absoluteOgImageUrl } from "@/lib/seo-config";
import { site } from "@/lib/site";
import { getToolBySlug, getTools } from "@/lib/tools";

type Props = { params: Promise<{ slug: string }> };

/** ISR — must stay in sync with `lib/programmatic-isr.ts` + `app/sitemap.ts` (Next needs a literal). */
export const revalidate = 2_592_000; // 30d

export async function generateStaticParams() {
  return getTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const title = `${tool.name} — free online ${tool.category.toLowerCase()} tool`;
  const description = `${tool.description} Works in your browser on ${site.domain}. ${tool.keywords.slice(0, 3).join(", ")}.`;
  const url = `${site.url}/tools/${tool.slug}`;
  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: absoluteOgImageUrl(), width: 512, height: 512, alt: tool.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteOgImageUrl()],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  return <ToolArticle tool={tool} />;
}
