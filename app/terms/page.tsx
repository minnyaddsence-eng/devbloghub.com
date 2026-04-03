import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms of use for ${site.domain}.`,
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl min-w-0 space-y-4 px-3 py-8 text-slate-300 sm:px-4 sm:py-12">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Terms &amp; Conditions</h1>
      <p>
        By using {site.name} you agree to these high-level terms. Replace with counsel-reviewed legal text before
        scaling revenue or collecting user accounts.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-white">No warranties</h2>
      <p>Tools are provided as-is. Outputs may be incorrect for edge cases — verify critical results independently.</p>
      <h2 className="mt-8 text-xl font-semibold text-white">Acceptable use</h2>
      <p>Do not use the site to harass, abuse, or process illegal content. Respect third-party terms for APIs you integrate.</p>
      <h2 className="mt-8 text-xl font-semibold text-white">Liability limit</h2>
      <p>To the maximum extent permitted by law, liability is limited for indirect or consequential damages.</p>
    </div>
  );
}
