import type { ToolDef } from "@/lib/types";
import { site, sitePrimaryAuthor } from "@/lib/site";
import { absoluteOgImageUrl } from "@/lib/seo-config";

const authorId = `${site.url}#primary-author`;

export function ToolWebApplicationJsonLd({ tool, pageUrl }: { tool: ToolDef; pageUrl: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: pageUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    author: {
      "@type": "Person",
      "@id": authorId,
      name: sitePrimaryAuthor.name,
      jobTitle: sitePrimaryAuthor.jobTitle,
      description: sitePrimaryAuthor.description,
      knowsAbout: sitePrimaryAuthor.knowsAbout,
      worksFor: {
        "@type": "Organization",
        name: site.name,
        url: site.url,
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    image: absoluteOgImageUrl(),
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
