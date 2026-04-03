import type { Metadata } from "next";
import { HomeSpotlights } from "@/components/HomeSpotlights";
import { HomeHero } from "@/components/HomeHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: site.url },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeSpotlights />
    </>
  );
}
