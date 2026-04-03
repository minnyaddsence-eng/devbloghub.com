import type { ToolDef } from "@/lib/types";
import { getRelatedTools } from "@/lib/tools";
import {
  DEFAULT_USE_CASE_SLUG,
  USE_CASE_SLUGS,
  type UseCaseSlug,
  getUseCaseTitle,
} from "@/lib/use-cases";

const titleCase = (s: string) =>
  s
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function humanizeSeoSlug(seoSlug: string): string {
  return titleCase(seoSlug.replace(/\.json$/i, ""));
}

/** Hub page / canonical tool landing — shorter, evergreen guide */
export function buildHubParagraphs(tool: ToolDef): string[] {
  const k = tool.keywords[0] ?? tool.name.toLowerCase();
  const intro = `${tool.name} helps you move faster on repetitive ${tool.category.toLowerCase()} tasks. On DevBlogHub, the page is statically generated for crisp SEO signals, while the interactive panel runs in your browser so you can iterate quickly on samples.`;

  const workflow = `Start small: paste a minimal example, validate the output, then scale to larger inputs. If you are handling secrets, prefer masked samples or local-only workflows for anything you cannot rotate quickly. For queries like ${k}, consistency and predictable errors matter more than flashy features.`;

  const quality = `Useful tool pages earn links when they answer intent clearly and connect readers to adjacent utilities. This hub links to long-tail variants that describe specific scenarios—so you can match your situation without wading through generic copy.`;

  const examples = `Keep a scratchpad of snippets you transform often: config blobs, API examples, log excerpts, or doc code fences. If a tool supports round-trips (encode/decode, minify/pretty), verify occasionally that you are not losing data silently.`;

  const pitfalls = `Watch for encoding mismatches, over-trimming whitespace that carries meaning in formats, and assumptions about sorted object keys in JSON-like structures. When something looks “almost right,” compare against a known-good source copy.`;

  return [intro, workflow, quality, examples, pitfalls];
}

const useCaseLens: Record<
  UseCaseSlug,
  (tool: ToolDef, focus: string, _scenario: string) => string
> = {
  "for-developers": (tool, focus, _s) =>
    `If you live in pull requests and CI logs, ${focus} is usually about tightening feedback loops. ${tool.name} helps you sanity-check payloads before you post them in tickets or attach them to design docs—without waiting for a local toolchain install. Pair the output with your team’s review checklist so formatting never masks real logic bugs.`,
  "for-beginners": (tool, focus, _s) =>
    `${focus} queries often come from people learning formats and protocols. ${tool.name} is structured to make mistakes visible: invalid inputs should fail loudly, and readable outputs help you build intuition. Treat this page like a sandbox—experiment with tiny examples before tackling production-sized blobs.`,
  "for-debugging": (tool, focus, _s) =>
    `During incidents, ${focus} searches spike because teams need a fast read on messy data. Use ${tool.name} to normalize structure so diffs are meaningful, then capture the before/after in your postmortem. Avoid pasting live credentials; redact tokens and use synthetic identifiers in screenshots.`,
  "for-api-response-checks": (tool, focus, _s) =>
    `API work rarely ends at a bare 200 OK. ${focus} is about making responses legible when fields nest deeply or when serializers omit optional keys. With ${tool.name}, you can confirm the shape you document in OpenAPI or README examples actually matches what clients observe in the wild.`,
  "for-large-files": (tool, focus, _s) =>
    `Browser utilities have practical size limits: very large inputs can choke the tab. For ${focus}, start with head/tail slices or split files offline, then use ${tool.name} on representative chunks. If you routinely process massive payloads, plan a CLI or streaming pipeline—but keep this tool for spot checks.`,
  "for-documentation": (tool, focus, _s) =>
    `Technical writers search ${focus} when examples need to be consistent and copy‑paste friendly. ${tool.name} helps normalize snippets so fences render cleanly in Markdown and static site generators. Align naming, indentation, and line breaks with your style guide so readers aren’t distracted by noise.`,
  "for-teaching": (tool, focus, _s) =>
    `In classrooms and workshops, ${focus} should be approachable on any laptop. ${tool.name} loads as static HTML first, which keeps demos resilient on conference Wi‑Fi. Encourage students to predict outputs before running the transform—then compare with the tool to reinforce mental models.`,
  "for-seo-content-teams": (tool, focus, _s) =>
    `Content teams care about ${focus} when publishing technical landing pages: examples must be valid, compact, and safe to display. ${tool.name} supports that editorial loop. Pair strong utilities with human-edited explanations so rankings reflect usefulness, not generated spam patterns.`,
  "for-quick-one-off-tasks": (tool, focus, _s) =>
    `Sometimes you just need ${focus} once, right now, on a machine that is not “fully loaded” with dev tools. ${tool.name} targets that moment: open the page, paste, ship the result, move on. Bookmark the scenario-specific URL if you expect to repeat the same workflow weekly.`,
  "for-privacy-conscious-workflows": (tool, focus, _s) =>
    `Searching ${focus} while working with sensitive material means treating every website as part of your threat model. ${tool.name} executes client-side where possible, but you should still avoid pasting production secrets. Prefer synthetic data, short-lived tokens, and isolation when stakes are high.`,
};

/** Long-tail: keyword + use case — extra differentiated copy */
export function buildLongTailParagraphs(
  tool: ToolDef,
  keywordSlug: string,
  useCaseSlug: UseCaseSlug,
): string[] {
  const focus = humanizeSeoSlug(keywordSlug);
  const scenario = getUseCaseTitle(useCaseSlug);

  const bridge = `This guide targets ${focus} in a ${scenario.toLowerCase()} context. ${tool.name} sits in the ${tool.category} family on DevBlogHub, and the on-page tool panel works locally in modern browsers so you can iterate quickly. The sections below walk through a realistic workflow, what “good” output looks like, and how to avoid common foot‑guns for your scenario.`;

  const lens = useCaseLens[useCaseSlug](tool, focus, scenario);

  const middle = `Regardless of scenario, a disciplined approach beats blindly pasting huge blobs. Validate incrementally, keep an unchanged source copy, and annotate what changed when you share results with teammates. For ${tool.keywords[1] ?? tool.name}, the objective is dependable transforms you can explain—not magical one-click fixes that hide structural problems.`;

  const tail = `Internal links on this site connect ${tool.name} to related utilities so you can move between formatting, validation, encoding, and generation tasks without hunting across ten different domains. That topical clustering helps readers and reinforces that each URL carries a distinct intent—even when pages share a similar layout.`;

  const hub = buildHubParagraphs(tool);
  return [bridge, lens, middle, tail, ...hub.slice(2)];
}

export function buildSecondaryFaqs(
  tool: ToolDef,
  keywordSlug: string,
  useCaseSlug?: UseCaseSlug,
): { q: string; a: string }[] {
  const focus = humanizeSeoSlug(keywordSlug);
  const scenario = useCaseSlug ? getUseCaseTitle(useCaseSlug) : null;

  const base = [
    {
      q: `What does “${focus}” mean in practice?`,
      a: `Readers searching ${focus} usually want the same outcome as ${tool.name}: a dependable conversion or inspection step with minimal setup. This page explains how to use the tool responsibly and what to expect from client-side processing.`,
    },
    {
      q: `How does ${tool.name} compare to desktop apps?`,
      a: `Desktop apps shine for huge files and bespoke automation. ${tool.name} focuses on quick, shareable browser workflows—ideal when you need results in minutes across different machines.`,
    },
    {
      q: "Can I use this on low bandwidth?",
      a: "Static HTML loads the narrative content first; interactive logic follows. After the first load, many actions work without extra network round-trips.",
    },
  ];

  if (scenario) {
    base.unshift({
      q: `Is ${tool.name} a good fit ${scenario.toLowerCase()}?`,
      a: `Yes—this URL is written for ${scenario.toLowerCase()}: it highlights workflow tips that map to that situation while keeping the same underlying ${tool.name} functionality.`,
    });
  }

  return base.slice(0, 8);
}

export function otherKeywordHrefs(
  tool: ToolDef,
  currentKeyword: string,
  useCase: string = DEFAULT_USE_CASE_SLUG,
): { href: string; label: string }[] {
  return tool.seoSlugs
    .filter((s) => s !== currentKeyword)
    .slice(0, 2)
    .map((s) => ({
      href: `/tools/${tool.slug}/${s}/${useCase}`,
      label: humanizeSeoSlug(s),
    }));
}

export function otherUseCaseHrefs(
  tool: ToolDef,
  keyword: string,
  currentUseCase: UseCaseSlug,
): { href: string; label: string }[] {
  return USE_CASE_SLUGS.filter((u) => u !== currentUseCase)
    .slice(0, 3)
    .map((u) => ({
      href: `/tools/${tool.slug}/${keyword}/${u}`,
      label: getUseCaseTitle(u),
    }));
}

export function pickRelatedForLinking(slug: string, n: number): ToolDef[] {
  return getRelatedTools(slug, n);
}
