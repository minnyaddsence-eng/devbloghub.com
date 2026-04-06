import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolArticle } from "@/components/ToolArticle";
import { humanizeSeoSlug } from "@/lib/seo-content";
import { absoluteOgImageUrl } from "@/lib/seo-config";
import { site } from "@/lib/site";
import { getToolBySlug, isValidSeoKeywordForTool } from "@/lib/tools";
import { getUseCaseTitle, isValidUseCaseSlug } from "@/lib/use-cases";

type Props = { params: Promise<{ slug: string; keyword: string; usecase: string }> };

/**
 * High-cardinality long-tail: render dynamically (Pages Router `getServerSideProps` equivalent).
 * No ISR/`revalidate` — avoids Vercel ISR writes when bots hammer many unique URLs.
 */
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, keyword, usecase } = await params;
  const tool = getToolBySlug(slug);
  if (!tool || !isValidSeoKeywordForTool(tool, keyword) || !isValidUseCaseSlug(usecase)) return {};
  const focus = humanizeSeoSlug(keyword);
  const scenario = getUseCaseTitle(usecase);
  const title = `${focus} — ${scenario} — ${tool.name}`;
  const description = `${tool.name} for ${focus.toLowerCase()}, ${scenario.toLowerCase()}. ${tool.description} Fast, client-side tool.`;
  const url = `${site.url}/tools/${slug}/${keyword}/${usecase}`;
  return {
    title,
    description,
    keywords: [...tool.keywords, focus, scenario],
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

export default async function ToolLongTailPage({ params }: Props) {
  const { slug, keyword, usecase } = await params;
  const tool = getToolBySlug(slug);
  if (!tool || !isValidSeoKeywordForTool(tool, keyword) || !isValidUseCaseSlug(usecase)) notFound();
  return <ToolArticle tool={tool} keyword={keyword} useCase={usecase} />;
}
