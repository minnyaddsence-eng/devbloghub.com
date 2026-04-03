import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.domain} and ${site.name}.`,
  alternates: { canonical: `${site.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl min-w-0 space-y-4 px-3 py-8 text-slate-300 sm:px-4 sm:py-12">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Privacy Policy</h1>
      <p>
        {site.name} ({site.domain}) provides client-side tools where possible. This policy explains typical data practices
        for static sites and optional advertising integrations.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-white">Information you provide</h2>
      <p>
        Tool inputs are processed in your browser. Do not paste secrets you cannot rotate into any website, including
        this one.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-white">Cookies and ads</h2>
      <p>
        If you enable Google AdSense or similar, Google may use cookies and collect device information as described in
        their policies. Update this section to match your actual ad partner configuration.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-white">Contact</h2>
      <p>
        For privacy questions, use the contact route once you publish a working inbox or form on{" "}
        <a href="/contact" className="text-cyan-300 hover:underline">/contact</a>.
      </p>
    </div>
  );
}
