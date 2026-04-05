import { site, sitePrimaryAuthor } from "@/lib/site";

const authorId = `${site.url}#primary-author`;

export function SiteSchemas() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}#organization`,
    name: site.name,
    url: site.url,
    description: site.description,
  };

  const author = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": authorId,
    name: sitePrimaryAuthor.name,
    jobTitle: sitePrimaryAuthor.jobTitle,
    description: sitePrimaryAuthor.description,
    knowsAbout: sitePrimaryAuthor.knowsAbout,
    worksFor: { "@id": `${site.url}#organization` },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { "@id": `${site.url}#organization` },
    creator: { "@id": authorId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(author) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
