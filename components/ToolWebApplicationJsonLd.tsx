import type { ToolDef } from "@/lib/types";
import { site } from "@/lib/site";
import { absoluteOgImageUrl } from "@/lib/seo-config";

export function ToolWebApplicationJsonLd({ tool, pageUrl }: { tool: ToolDef; pageUrl: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: pageUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
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
