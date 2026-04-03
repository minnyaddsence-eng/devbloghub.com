import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — free developer tools and SEO-friendly static pages.`,
  alternates: { canonical: `${site.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl min-w-0 px-3 py-8 sm:px-4 sm:py-12">
      <h1 className="text-balance text-2xl font-bold text-white sm:text-3xl">About {site.name}</h1>
      <p className="mt-4 text-slate-300">
        {site.name} is a static-first toolkit for daily developer chores — JSON formatting, encoding, UUID and password
        generation, JWT decoding, and more. The architecture emphasizes speed, clarity, and responsible programmatic SEO.
      </p>
      <p className="mt-4 text-slate-300">
        Read our <Link href="/blog/client-side-tools-seo-playbook" className="text-cyan-300 hover:underline">SEO playbook</Link>{" "}
        or jump into <Link href="/" className="text-cyan-300 hover:underline">the tool directory</Link>.
      </p>
    </div>
  );
}
