import { site } from "@/lib/site";
import type { Crumb } from "@/components/Breadcrumbs";

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const chain = items.filter((i) => i.href);
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: chain.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: c.label,
      item: `${site.url}${c.href}`,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
