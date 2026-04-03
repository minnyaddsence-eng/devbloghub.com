import type { Metadata } from "next";
import { HomeShell } from "@/components/home/HomeShell";
import { getTools } from "@/lib/tools";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: site.url },
};

export default function HomePage() {
  return <HomeShell tools={getTools()} />;
}
