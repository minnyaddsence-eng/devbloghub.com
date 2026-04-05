import type { ToolDef } from "@/lib/types";
import { getExpandedSeoSlugsForTool, getRelatedTools } from "@/lib/tools";
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

/** Stable hash for URL-keyed copy variants (paragraph order, FAQ picks, specs rows). */
export function longTailContentHash(slug: string, keywordSlug: string, useCaseSlug: string): number {
  const s = `${slug}|${keywordSlug}|${useCaseSlug}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
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
  "for-ci-cd-pipelines": (tool, focus, _s) =>
    `In CI/CD, ${focus} often shows up when validating artifacts, config exports, or build logs before promotion. ${tool.name} is a fast human-in-the-loop check when you cannot wait for a full local repro—paste a slice, confirm structure, and attach the normalized output to the pipeline ticket.`,
  "for-localhost-testing": (tool, focus, _s) =>
    `Localhost work pairs oddly well with ${focus}: you are moving fast, swapping ports, and copying payloads from DevTools. ${tool.name} gives you a stable formatting layer so “what I sent” and “what I meant” stay aligned when you compare against staging or production traces.`,
  "for-microservices-debugging": (tool, focus, _s) =>
    `Microservices multiply surfaces where ${focus} becomes relevant—queue payloads, gRPC JSON bridges, and partial failures. Use ${tool.name} to collapse noise into a readable shape before you decide which service actually mis-serialized data.`,
  "for-open-source-contributors": (tool, focus, _s) =>
    `Contributors triage issues with ${focus} in issue templates, repro steps, and pasted logs. ${tool.name} helps you turn messy snippets into something reviewers can skim, which speeds up merge discussions without asking everyone to install the same CLI plugins.`,
  "for-mobile-web-testing": (tool, focus, _s) =>
    `Mobile web testing surfaces ${focus} when you copy network responses or reduced repros from remote devices. ${tool.name} runs in the mobile browser too—handy when you need a transform on a phone or tablet without syncing files back to a laptop first.`,
  "for-data-migration-tasks": (tool, focus, _s) =>
    `Migrations are where ${focus} meets legacy quirks: odd encodings, CSV oddities, or half-valid JSON. ${tool.name} is not a database engine, but it excels at validating representative rows and snippets before you script the full ETL batch.`,
  "for-security-review-prep": (tool, focus, _s) =>
    `Security reviews often require ${focus} on redacted samples: tokens stripped, IDs synthetic. ${tool.name} supports that prep pass—normalize structure so reviewers focus on control flow, not indentation noise, and never paste live secrets.`,
  "for-performance-profiling-notes": (tool, focus, _s) =>
    `Profiling notes frequently include ${focus} in stack excerpts, trace fragments, or config dumps. ${tool.name} helps you compress those blobs into comparable forms when you file performance regressions next to flamegraph screenshots.`,
  "for-cross-team-handoffs": (tool, focus, _s) =>
    `Handoffs between frontend, backend, and data teams fail when ${focus} is ambiguous in Slack threads. ${tool.name} gives both sides the same normalized artifact to reference, reducing “works on my machine” debates about invisible whitespace or key order.`,
  "for-automation-scripting-prep": (tool, focus, _s) =>
    `Before you automate ${focus} in a script, prove the transform on samples in ${tool.name}. Once outputs look stable, promote the same rules into code with confidence—you already validated edge cases interactively in the browser.`,
};

/** Long-tail: keyword + use case — differentiated copy; paragraph order varies by URL hash (5 structures). */
export function buildLongTailParagraphs(
  tool: ToolDef,
  keywordSlug: string,
  useCaseSlug: UseCaseSlug,
): string[] {
  const focus = humanizeSeoSlug(keywordSlug);
  const scenario = getUseCaseTitle(useCaseSlug);
  const h = longTailContentHash(tool.slug, keywordSlug, useCaseSlug);
  const variant = h % 5;

  const bridge = `This guide targets ${focus} in a ${scenario.toLowerCase()} context. ${tool.name} sits in the ${tool.category} family on DevBlogHub, and the on-page tool panel works locally in modern browsers so you can iterate quickly. The sections below walk through a realistic workflow, what “good” output looks like, and how to avoid common foot‑guns for your scenario.`;

  const lens = useCaseLens[useCaseSlug](tool, focus, scenario);

  const middle = `Regardless of scenario, a disciplined approach beats blindly pasting huge blobs. Validate incrementally, keep an unchanged source copy, and annotate what changed when you share results with teammates. For ${tool.keywords[1] ?? tool.name}, the objective is dependable transforms you can explain—not magical one-click fixes that hide structural problems.`;

  const tail = `Internal links on this site connect ${tool.name} to related utilities so you can move between formatting, validation, encoding, and generation tasks without hunting across ten different domains. That topical clustering helps readers and reinforces that each URL carries a distinct intent—even when pages share a similar layout.`;

  const hub = buildHubParagraphs(tool);
  const hubExtra = hub.slice(2);

  const leadA = `Searchers landing on ${focus} with a ${scenario.toLowerCase()} lens usually want clarity before speed. ${tool.name} is framed for that sequence: read the scenario notes, then run the panel on a small sample.`;
  const leadB = `If your next step depends on ${focus}, treat ${tool.name} as a checkpoint—not the final system of record. The browser panel is ideal for verification, diff-friendly output, and sharing normalized snippets in chat.`;
  const leadC = `This URL intentionally combines “${focus}” with “${scenario}” so the narrative matches long-tail intent. ${tool.name} stays the same underneath, but the guidance shifts to match how that audience typically works.`;
  const leadD = `Before you commit to a toolchain change, sanity-check ${focus} with ${tool.name} on real samples from your repo or tickets. You will catch formatting assumptions early while the cost of correction is still low.`;
  const leads = [leadA, leadB, leadC, leadD];
  const leadPick = leads[h % leads.length];

  switch (variant) {
    case 0:
      return [bridge, lens, middle, tail, ...hubExtra];
    case 1:
      return [leadPick, bridge, lens, tail, middle, hub[3] ?? hub[2], hub[4] ?? hub[3]].filter(Boolean) as string[];
    case 2:
      return [lens, bridge, middle, tail, ...hubExtra];
    case 3:
      return [
        `Checklist-style start: (1) Identify your ${focus} sample. (2) Run it through ${tool.name}. (3) Compare output against a known-good reference. (4) Document what changed for ${scenario.toLowerCase()} readers.`,
        bridge,
        lens,
        middle,
        tail,
        hub[2] ?? hub[1],
      ];
    default:
      return [
        `Practical note: ${tool.category} workflows that mention ${focus} often overlap with adjacent utilities on this site—bookmark both the hub and this scenario page.`,
        bridge,
        lens,
        middle,
        tail,
        ...hubExtra,
      ];
  }
}

type FaqFactory = (tool: ToolDef, focus: string, scenario: string) => { q: string; a: string };

const LONG_TAIL_FAQ_POOL: FaqFactory[] = [
  (t, f, s) => ({
    q: `Why pair “${f}” with ${s}?`,
    a: `That pairing reflects how people search: they want ${t.name} for a specific job-to-be-done, not a generic landing page. This write-up aligns tips with that intent.`,
  }),
  (t, f, _s) => ({
    q: `What input size is realistic for ${t.name} when exploring ${f}?`,
    a: `Start with kilobytes to low megabytes in the browser tab. If the tab slows down, split the payload and process representative chunks instead of one giant paste.`,
  }),
  (t, f, s) => ({
    q: `Does ${t.name} change behavior on this ${s} URL vs the main tool page?`,
    a: `The interactive behavior is the same; the surrounding guidance, FAQs, and internal links emphasize ${s.toLowerCase()} so the page matches your situation.`,
  }),
  (t, f, _s) => ({
    q: `How should I cite outputs when sharing ${f} results with my team?`,
    a: `Paste the normalized output alongside a one-line note on what transform you applied in ${t.name}. That context prevents “mystery JSON” in Slack threads.`,
  }),
  (t, f, _s) => ({
    q: `Is ${t.name} a replacement for IDE plugins for ${f}?`,
    a: `IDE plugins excel at project-wide refactors. ${t.name} wins for quick, shareable, cross-machine checks—especially when onboarding someone without your local setup.`,
  }),
  (t, f, s) => ({
    q: `What mistakes do people make with ${f} in a ${s.toLowerCase()} workflow?`,
    a: `Pasting secrets, assuming lossless round-trips without testing, and skipping a saved “before” copy. ${t.name} makes errors visible—still keep your own backups.`,
  }),
  (t, f, _s) => ({
    q: `Can I use ${t.name} offline after the first load?`,
    a: `Many transforms run client-side once assets are cached, but you should still plan for network availability on first visit and avoid relying on offline mode for critical security reviews.`,
  }),
  (t, f, s) => ({
    q: `Which related tools should I open after ${t.name} for ${s}?`,
    a: `Use the “Related tools” and keyword links on this page—they stay within the same topical cluster so you can chain validation, encoding, and formatting steps.`,
  }),
  (t, f, _s) => ({
    q: `How does ${t.name} relate to ${t.category.toLowerCase()} best practices?`,
    a: `It automates a narrow slice of that practice: readable outputs, quick validation, and predictable errors—so you can apply category-specific rules on top with confidence.`,
  }),
  (t, f, s) => ({
    q: `Is this page meant for production ${f} data?`,
    a: `Only if your policy allows browser processing. For regulated environments, prefer synthetic data here, then run approved tooling on real payloads behind your org boundary.`,
  }),
  (t, f, _s) => ({
    q: `What does “client-side” mean for ${t.name} and ${f}?`,
    a: `Where possible, your input is processed in the browser rather than uploaded to our servers for that transform. You should still treat any website as untrusted for highly sensitive secrets.`,
  }),
  (t, f, s) => ({
    q: `Will ${t.name} stay fast for ${s} users on older hardware?`,
    a: `Static HTML loads first; heavy work runs after hydration. If performance dips, reduce input size and close other tabs—browser transforms share the same JS thread as the page UI.`,
  }),
];

/**
 * 3–5 FAQ entities per long-tail URL, deterministic from hash — good for FAQPage JSON-LD uniqueness.
 */
export function buildLongTailFaqBundle(
  tool: ToolDef,
  keywordSlug: string,
  useCaseSlug: UseCaseSlug,
): { q: string; a: string }[] {
  const h = longTailContentHash(tool.slug, keywordSlug, useCaseSlug);
  const focus = humanizeSeoSlug(keywordSlug);
  const scenario = getUseCaseTitle(useCaseSlug);
  const count = 3 + (h % 3);
  const used = new Set<string>();
  const out: { q: string; a: string }[] = [];
  let step = 0;
  while (out.length < count && step < LONG_TAIL_FAQ_POOL.length * 2) {
    const factory = LONG_TAIL_FAQ_POOL[(h + step * 5) % LONG_TAIL_FAQ_POOL.length];
    const item = factory(tool, focus, scenario);
    if (!used.has(item.q)) {
      used.add(item.q);
      out.push(item);
    }
    step += 1;
  }
  return out;
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
  return getExpandedSeoSlugsForTool(tool)
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
