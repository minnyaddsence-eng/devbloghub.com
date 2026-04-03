import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name}.`,
  alternates: { canonical: `${site.url}/contact` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl min-w-0 px-3 py-8 sm:px-4 sm:py-12">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Contact</h1>
      <p className="mt-4 text-slate-300">
        Add a form provider (Formspree, Getform) or publish a mailto for your team. Placeholder page for {site.domain}.
      </p>
    </div>
  );
}
