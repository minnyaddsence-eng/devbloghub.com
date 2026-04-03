import type { BlogPost } from "@/lib/types";
import { site } from "@/lib/site";
import { absoluteOgImageUrl } from "@/lib/seo-config";

export function BlogArticleJsonLd({ post }: { post: BlogPost }) {
  const url = `${site.url}/blog/${post.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteOgImageUrl(),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: [absoluteOgImageUrl()],
    keywords: post.tags.join(", "),
    articleSection: "Developer tools",
    inLanguage: "en-US",
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
