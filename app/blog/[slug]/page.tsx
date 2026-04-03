import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassPanel } from "@/components/GlassPanel";
import { getPostBySlug, getPosts } from "@/lib/blog";
import { site } from "@/lib/site";
import { getToolBySlug } from "@/lib/tools";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `${site.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, url, siteName: site.name, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl min-w-0 px-3 py-8 sm:px-4 sm:py-12">
      <p className="text-sm text-cyan-300/80">Blog · {post.date}</p>
      <h1 className="mt-3 text-balance break-words text-2xl font-bold text-white sm:text-3xl md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-base text-slate-300 sm:text-lg">{post.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-8 max-w-none space-y-8 break-words text-slate-300 sm:mt-10">
        {post.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">{s.heading}</h2>
            <p className="mt-3 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <GlassPanel className="mt-10 min-w-0 p-4 sm:mt-12 sm:p-6">
        <h3 className="text-lg font-semibold text-white">Try these tools next</h3>
        <ul className="mt-4 space-y-4 text-cyan-200/90 sm:space-y-3">
          {post.relatedToolSlugs.map((ts) => {
            const tool = getToolBySlug(ts);
            if (!tool) return null;
            return (
              <li key={ts} className="break-words">
                <Link href={`/tools/${tool.slug}`} className="font-medium hover:underline">
                  {tool.name}
                </Link>
                <span className="mt-1 block text-sm text-slate-500 sm:mt-0 sm:inline"> — {tool.description}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm text-slate-400">
          Back to <Link href="/">all tools</Link> or browse the <Link href="/blog">blog index</Link>.
        </p>
      </GlassPanel>
    </article>
  );
}
