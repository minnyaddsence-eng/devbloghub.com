"use client";

import { useMemo, useState } from "react";
import { CopyButton, ToolFrame, btnClass, btnGhost, inputClass } from "@/components/tools/impl/_shared";

const C32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function ulidEncodeTime(ms: number): string {
  let t = ms;
  let s = "";
  for (let i = 9; i >= 0; i--) {
    const m = t % 32;
    s = C32[m] + s;
    t = Math.floor(t / 32);
  }
  return s.padStart(10, "0").slice(-10);
}

function ulidEncodeRandom(len: number): string {
  const b = new Uint8Array(len);
  crypto.getRandomValues(b);
  let s = "";
  for (let i = 0; i < len; i++) s += C32[b[i] % 32];
  return s;
}

export function UlidGenerator52Tool() {
  const [ids, setIds] = useState<string[]>([]);
  const gen = (n: number) => {
    const out: string[] = [];
    for (let i = 0; i < n; i++) out.push(ulidEncodeTime(Date.now()) + ulidEncodeRandom(16));
    setIds(out);
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={() => gen(1)}>1</button><button className={btnGhost} onClick={() => gen(5)}>5</button>{ids.length ? <CopyButton text={ids.join("\n")} label="Copy" /> : null}</>}>
      <textarea className={inputClass} readOnly value={ids.join("\n")} />
    </ToolFrame>
  );
}

const NANOID = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

export function NanoidGenerator53Tool() {
  const [len, setLen] = useState(21);
  const [out, setOut] = useState("");
  const gen = () => {
    const b = new Uint8Array(len);
    crypto.getRandomValues(b);
    setOut([...b].map((x) => NANOID[x % NANOID.length]).join(""));
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={gen}>Generate</button>{out ? <CopyButton text={out} label="Copy" /> : null}</>}>
      <label className="text-sm text-slate-400">
        Length
        <input type="number" min={8} max={64} className="ml-2 w-16 rounded border border-white/15 bg-black/40 px-1" value={len} onChange={(e) => setLen(+e.target.value)} />
      </label>
      {out && <input readOnly className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono" value={out} />}
    </ToolFrame>
  );
}

export function OtpGenerator54Tool() {
  const [digits, setDigits] = useState(6);
  const [out, setOut] = useState("");
  const gen = () => {
    const b = new Uint8Array(4);
    crypto.getRandomValues(b);
    const n = (b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3];
    const mod = 10 ** digits;
    setOut(String((n >>> 0) % mod).padStart(digits, "0"));
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={gen}>Generate</button>{out ? <CopyButton text={out} label="Copy" /> : null}</>}>
      <label className="text-sm text-slate-400">
        Digits
        <input type="number" min={4} max={10} className="ml-2 w-16 rounded border border-white/15 bg-black/40 px-1" value={digits} onChange={(e) => setDigits(+e.target.value)} />
      </label>
      {out && <p className="text-2xl font-mono text-cyan-300">{out}</p>}
    </ToolFrame>
  );
}

export function TotpQrBuilder55Tool() {
  const [secret, setSecret] = useState("JBSWY3DPEHPK3PXP");
  const [label, setLabel] = useState("DevBlogHub:user@example.com");
  const [issuer, setIssuer] = useState("DevBlogHub");
  const uri = useMemo(
    () => `otpauth://totp/${encodeURIComponent(label)}?secret=${secret.replace(/\s/g, "")}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`,
    [secret, label, issuer],
  );
  return (
    <ToolFrame actions={<CopyButton text={uri} label="Copy otpauth URI" />}>
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Base32 secret" />
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
      <textarea className={inputClass} readOnly value={uri} />
    </ToolFrame>
  );
}

export function ApiKeyGenerator48Tool() {
  const [out, setOut] = useState("");
  const gen = () => {
    const b = new Uint8Array(32);
    crypto.getRandomValues(b);
    setOut([...b].map((x) => x.toString(16).padStart(2, "0")).join(""));
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={gen}>Generate hex key</button>{out ? <CopyButton text={out} label="Copy" /> : null}</>}>
      {out && <textarea className={inputClass} readOnly value={out} />}
    </ToolFrame>
  );
}

export function HmacHelper49Tool() {
  const [secret, setSecret] = useState("key");
  const [msg, setMsg] = useState("message");
  const [out, setOut] = useState("");
  const run = async () => {
    const s = new TextEncoder().encode(secret);
    const m = new TextEncoder().encode(msg);
    const ksk = await crypto.subtle.importKey("raw", s, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", ksk, m);
    setOut(
      [...new Uint8Array(sig)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    );
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={run}>HMAC-SHA256 hex</button>{out ? <CopyButton text={out} label="Copy" /> : null}</>}>
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Secret" />
      <textarea className={inputClass} value={msg} onChange={(e) => setMsg(e.target.value)} />
      {out && <textarea className={inputClass} readOnly value={out} />}
    </ToolFrame>
  );
}

export function PemDecoder50Tool() {
  const [t, setT] = useState(
    "-----BEGIN CERTIFICATE-----\nMIIBkTCB+wIJAK...\n-----END CERTIFICATE-----",
  );
  const body = useMemo(() => {
    const m = t.match(/-----BEGIN [^-]+-----([\s\S]*?)-----END [^-]+-----/);
    if (!m) return "";
    try {
      const bin = atob(m[1].replace(/\s/g, ""));
      return `Decoded ${bin.length} bytes (raw preview not shown). Base64 payload length: ${m[1].replace(/\s/g, "").length}`;
    } catch {
      return "Invalid base64 in PEM";
    }
  }, [t]);
  return (
    <ToolFrame>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className="text-sm text-slate-300">{body}</p>
    </ToolFrame>
  );
}

export function CsrParser51Tool() {
  const [t, setT] = useState("-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----");
  return (
    <ToolFrame>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className="text-sm text-slate-400">PEM CSR viewer: paste CSR; ASN.1 parsing needs a library — here you validate PEM framing only.</p>
      <p className="text-xs font-mono text-cyan-200/80">
        {/BEGIN CERTIFICATE REQUEST/.test(t) && /END CERTIFICATE REQUEST/.test(t) ? "PEM frame looks OK." : "Missing CSR PEM headers."}
      </p>
    </ToolFrame>
  );
}

function scorePassword(p: string): { score: number; label: string } {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[a-z]/.test(p)) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^a-z0-9]/i.test(p)) s++;
  const label = s <= 2 ? "Weak" : s <= 4 ? "Medium" : "Strong";
  return { score: s, label };
}

export function PasswordStrengthMeter56Tool() {
  const [p, setP] = useState("");
  const { score, label } = useMemo(() => scorePassword(p), [p]);
  return (
    <ToolFrame>
      <input type="password" className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3" value={p} onChange={(e) => setP(e.target.value)} />
      <p className="text-lg">
        {label} <span className="text-slate-500">({score}/6 checks)</span>
      </p>
    </ToolFrame>
  );
}

export function EnvironmentVarEscaper57Tool() {
  const [t, setT] = useState(`hello "world"`);
  const [out, setOut] = useState("");
  const sh = () => setOut(`'${t.replace(/'/g, `'\\''`)}'`);
  const win = () => setOut(`"${t.replace(/"/g, '\\"')}"`);
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={sh}>POSIX single-quote</button><button className={btnGhost} onClick={win}>Windows-ish double-quote</button>{out ? <CopyButton text={out} label="Copy" /> : null}</>}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      {out && <textarea className={inputClass} readOnly value={out} />}
    </ToolFrame>
  );
}

export function DotenvParser58Tool() {
  const [t, setT] = useState("FOO=bar\n#c\nBAZ=42");
  const json = useMemo(() => {
    const o: Record<string, string> = {};
    t.split(/\r?\n/).forEach((line) => {
      const s = line.trim();
      if (!s || s.startsWith("#")) return;
      const i = s.indexOf("=");
      if (i === -1) return;
      o[s.slice(0, i).trim()] = s.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    });
    return JSON.stringify(o, null, 2);
  }, [t]);
  return (
    <ToolFrame actions={<CopyButton text={json} label="Copy JSON" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={json} />
    </ToolFrame>
  );
}

export function TomlToJson59Tool() {
  const [t, setT] = useState('[pkg]\nname = "demo"\nversion = "1.0.0"');
  const [out, setOut] = useState("");
  const run = () => {
    try {
      const root: Record<string, unknown> = {};
      let section = root;
      t.split(/\r?\n/).forEach((line) => {
        const s = line.trim();
        if (!s || s.startsWith("#")) return;
        const sec = s.match(/^\[([^\]]+)\]$/);
        if (sec) {
          section = {};
          root[sec[1]] = section;
          return;
        }
        const kv = s.match(/^([^=]+)=(.+)$/);
        if (kv) {
          let v = kv[2].trim();
          if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
          else if (/^(true|false|\d+)$/.test(v)) section[kv[1].trim()] = v === "true" ? true : v === "false" ? false : Number(v);
          else section[kv[1].trim()] = v;
        }
      });
      setOut(JSON.stringify(root, null, 2));
    } catch {
      setOut("{}");
    }
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={run}>Convert (minimal TOML)</button>{out ? <CopyButton text={out} label="Copy" /> : null}</>}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      {out && <textarea className={inputClass} readOnly value={out} />}
    </ToolFrame>
  );
}

export function EditorconfigGenerator60Tool() {
  const [indent, setIndent] = useState(2);
  const out = `root = true\n\n[*]\nindent_style = space\nindent_size = ${indent}\nend_of_line = lf\ncharset = utf-8\ninsert_final_newline = true`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <label className="text-slate-300">
        indent_size
        <input type="number" min={2} max={8} className="ml-2 w-16 rounded border border-white/15 bg-black/40 px-1" value={indent} onChange={(e) => setIndent(+e.target.value)} />
      </label>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function GitignoreMerger61Tool() {
  const [a, setA] = useState("node_modules\n.env");
  const [b, setB] = useState(".next\nnode_modules");
  const out = useMemo(() => [...new Set([...a.split(/\r?\n/), ...b.split(/\r?\n/)].map((x) => x.trim()).filter(Boolean))].sort().join("\n"), [a, b]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy merged" />}>
      <div className="grid gap-4 md:grid-cols-2 min-h-[120px]">
        <textarea className={inputClass} value={a} onChange={(e) => setA(e.target.value)} placeholder="file A" />
        <textarea className={inputClass} value={b} onChange={(e) => setB(e.target.value)} placeholder="file B" />
      </div>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

function bumpSemver(cur: string, t: "major" | "minor" | "patch"): string {
  const m = cur.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return cur;
  let [ma, mi, p] = [+m[1], +m[2], +m[3]];
  if (t === "major") {
    ma++;
    mi = 0;
    p = 0;
  } else if (t === "minor") {
    mi++;
    p = 0;
  } else p++;
  return `${ma}.${mi}.${p}`;
}

export function SemverCalculator62Tool() {
  const [v, setV] = useState("1.2.3");
  const [out, setOut] = useState("");
  return (
    <ToolFrame
      actions={
        <>
          <button className={btnClass} onClick={() => setOut(bumpSemver(v, "patch"))}>
            +patch
          </button>
          <button className={btnGhost} onClick={() => setOut(bumpSemver(v, "minor"))}>
            +minor
          </button>
          <button className={btnGhost} onClick={() => setOut(bumpSemver(v, "major"))}>
            +major
          </button>
          {out ? <CopyButton text={out} label="Copy" /> : null}
        </>
      }
    >
      <input className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono" value={v} onChange={(e) => setV(e.target.value)} />
      {out && <p className="text-xl text-cyan-300">{out}</p>}
    </ToolFrame>
  );
}

export function ChangelogFormatter63Tool() {
  const [title, setTitle] = useState("Fixed bugs");
  const date = new Date().toISOString().slice(0, 10);
  const out = `## [Unreleased] - ${date}\n\n### ${title}\n- your bullet here\n`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function BranchNameSlugger64Tool() {
  const [t, setT] = useState("Feature: Cool Stuff!");
  const out = useMemo(() => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60), [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy branch name" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className="font-mono text-cyan-300">{out}</p>
    </ToolFrame>
  );
}

export function ReadmeTocGenerator65Tool() {
  const [t, setT] = useState("# Hi\n\n## Setup\n\ntext\n\n## API\n\nmore");
  const out = useMemo(() => {
    const lines = t.split(/\r?\n/);
    const toc: string[] = [];
    lines.forEach((line) => {
      const m = line.match(/^(#{2,3})\s+(.+)$/);
      if (!m) return;
      const depth = m[1].length;
      const text = m[2].trim();
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      const ind = depth === 2 ? "- " : "  - ";
      toc.push(`${ind}[${text}](#${slug})`);
    });
    return toc.join("\n");
  }, [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy TOC" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function BadgeGenerator66Tool() {
  const [label, setLabel] = useState("build");
  const [msg, setMsg] = useState("passing");
  const [color, setColor] = useState("green");
  const url = useMemo(
    () => `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(msg)}-${color}`,
    [label, msg, color],
  );
  return (
    <ToolFrame actions={<CopyButton text={`[![${label}](${url})](https://devbloghub.com)`} label="Copy markdown" />}>
      <div className="flex flex-wrap gap-2">
        <input className="rounded border border-white/15 bg-black/40 px-2 py-1" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input className="rounded border border-white/15 bg-black/40 px-2 py-1" value={msg} onChange={(e) => setMsg(e.target.value)} />
        <input className="rounded border border-white/15 bg-black/40 px-2 py-1" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <p className="break-all text-xs text-slate-400">{url}</p>
    </ToolFrame>
  );
}

export function RobotsRuleBuilder67Tool() {
  const [ua, setUa] = useState("*");
  const [dis, setDis] = useState("/admin");
  const out = `User-agent: ${ua}\nDisallow: ${dis}\n`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={ua} onChange={(e) => setUa(e.target.value)} />
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={dis} onChange={(e) => setDis(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function CanonicalUrlBuilder68Tool() {
  const [u, setU] = useState("https://devbloghub.com/tools/json-formatter");
  const out = `<link rel="canonical" href="${u}" />`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <input className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3" value={u} onChange={(e) => setU(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function HreflangTagBuilder69Tool() {
  const [en, setEn] = useState("https://devbloghub.com/page");
  const [bn, setBn] = useState("https://devbloghub.com/bn/page");
  const out = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="bn" href="${bn}" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={en} onChange={(e) => setEn(e.target.value)} placeholder="en URL" />
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={bn} onChange={(e) => setBn(e.target.value)} placeholder="bn URL" />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function JsonLdFaqBuilder70Tool() {
  const [q, setQ] = useState("Is it free?");
  const [a, setA] = useState("Yes.");
  const out = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }],
    },
    null,
    2,
  );
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy JSON-LD" />}>
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={q} onChange={(e) => setQ(e.target.value)} />
      <textarea className={inputClass} value={a} onChange={(e) => setA(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function BreadcrumbJsonLd71Tool() {
  const items = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: "JSON", path: "/tools/json-formatter" },
  ];
  const out = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: `https://devbloghub.com${it.path}`,
      })),
    },
    null,
    2,
  );
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

function schemaShell(
  type: string,
  extra: Record<string, unknown>,
) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": type, ...extra }, null, 2);
}

export function OrganizationSchemaHelper72Tool() {
  const out = schemaShell("Organization", { name: "DevBlogHub", url: "https://devbloghub.com" });
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function ArticleSchemaHelper73Tool() {
  const out = schemaShell("Article", {
    headline: "Sample",
    author: { "@type": "Person", name: "Author" },
    datePublished: new Date().toISOString().slice(0, 10),
  });
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function ProductSchemaHelper74Tool() {
  const out = schemaShell("Product", { name: "Tool", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } });
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function EventSchemaHelper75Tool() {
  const out = schemaShell("Event", {
    name: "Meetup",
    startDate: new Date().toISOString(),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  });
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function RecipeSchemaHelper76Tool() {
  const out = schemaShell("Recipe", { name: "Demo", recipeIngredient: ["a", "b"], recipeInstructions: [{ "@type": "HowToStep", text: "Mix." }] });
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function LocalBusinessSchema77Tool() {
  const out = schemaShell("LocalBusiness", { name: "Shop", address: { "@type": "PostalAddress", addressCountry: "BD" } });
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function SitemapXmlFormatter78Tool() {
  const [t, setT] = useState('<?xml version="1.0"?><urlset><url><loc>https://a.com</loc></url></urlset>');
  const out = useMemo(() => {
    try {
      const p = new DOMParser();
      const d = p.parseFromString(t, "text/xml");
      const s = new XMLSerializer();
      return s.serializeToString(d).replace(/><(\/?)/g, ">\n<$1");
    } catch {
      return t;
    }
  }, [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function ContentTypeBuilder79Tool() {
  const [t, setT] = useState("multipart/form-data");
  const [b, setB] = useState("boundary=----abc");
  const out = b ? `${t}; ${b}` : t;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={t} onChange={(e) => setT(e.target.value)} />
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={b} onChange={(e) => setB(e.target.value)} />
      <p className="font-mono text-cyan-200">{out}</p>
    </ToolFrame>
  );
}

export function CacheControlBuilder80Tool() {
  const [max, setMax] = useState(3600);
  const [pub, setPub] = useState(true);
  const out = `${pub ? "public" : "private"}, max-age=${max}`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" checked={pub} onChange={(e) => setPub(e.target.checked)} />
        public
      </label>
      <label className="text-sm text-slate-300">
        max-age (seconds)
        <input type="number" min={0} className="ml-2 w-28 rounded border border-white/15 bg-black/40 px-2 py-1" value={max} onChange={(e) => setMax(+e.target.value)} />
      </label>
      <p className="font-mono text-cyan-200">{out}</p>
    </ToolFrame>
  );
}

export function SecurityTxtBuilder81Tool() {
  const out = `Contact: mailto:security@devbloghub.com\nPreferred-Languages: en\n`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function HumansTxtBuilder82Tool() {
  const out = `/* TEAM */\nDeveloper: DevBlogHub\nContact: hello@devbloghub.com\n`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

const ADS_LINE = /^([^,]+),\s*([^,]+),\s*(DIRECT|RESELLER),\s*[a-f0-9]{16}$/i;

export function AdsTxtLineChecker83Tool() {
  const [t, setT] = useState("google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0");
  const ok = useMemo(() => t.trim().split("\n").every((line) => !line.trim() || line.startsWith("#") || ADS_LINE.test(line)), [t]);
  return (
    <ToolFrame>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className={ok ? "text-emerald-300" : "text-rose-300"} role="status">
        {ok ? "Lines look like valid ads.txt entries (basic check)." : "Some lines do not match domain, pub, DIRECT|RESELLER, ID pattern."}
      </p>
    </ToolFrame>
  );
}

export function AppAdsTxtChecker84Tool() {
  const [t, setT] = useState("applovin.com, pub-id, DIRECT, f08c47fec0942fa0");
  const ok = useMemo(() => t.trim().split("\n").every((line) => !line.trim() || line.startsWith("#") || ADS_LINE.test(line)), [t]);
  return (
    <ToolFrame>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className={ok ? "text-emerald-300" : "text-rose-300"}>{ok ? "Basic format OK for app-ads.txt style lines." : "Check failed on at least one line."}</p>
    </ToolFrame>
  );
}

export function SlugCollisionChecker85Tool() {
  const [a, setA] = useState("My Post!");
  const [b, setB] = useState("my-post");
  const sa = useMemo(() => a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), [a]);
  const sb = useMemo(() => b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), [b]);
  const clash = sa === sb && sa.length > 0;
  return (
    <ToolFrame>
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={a} onChange={(e) => setA(e.target.value)} />
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={b} onChange={(e) => setB(e.target.value)} />
      <p>
        <span className="text-slate-400">{sa}</span> vs <span className="text-slate-400">{sb}</span>
      </p>
      <p className={clash ? "text-rose-300" : "text-emerald-300"}>{clash ? "Collision: same slug." : "No collision."}</p>
    </ToolFrame>
  );
}

export function MetaTitleLengthChecker86Tool() {
  const [t, setT] = useState("DevBlogHub — 100+ Free Developer Tools for SEO");
  const len = t.length;
  const warn = len > 60;
  return (
    <ToolFrame>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className={warn ? "text-amber-200" : "text-emerald-300"}>
        {len} chars {warn ? "(many SEOs aim ≤~60)" : ""}
      </p>
    </ToolFrame>
  );
}

export function MetaDescriptionPreview87Tool() {
  const [t, setT] = useState("Free JSON formatter, Base64, UUID, JWT tools — fast client-side utilities.");
  const len = t.length;
  const snippet = t.slice(0, 160);
  return (
    <ToolFrame>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className="text-sm text-slate-400">{len} chars {len > 160 ? "(often aim ≤~160)" : ""}</p>
      <div className="rounded-lg border border-white/15 bg-black/40 p-3 text-sm text-slate-300">Google-style snippet: {snippet}{len > 160 ? "…" : ""}</div>
    </ToolFrame>
  );
}

export function OpenGraphTagBuilder88Tool() {
  const [titleV, setTitleV] = useState("DevBlogHub Tools");
  const [url, setUrl] = useState("https://devbloghub.com");
  const out = `<meta property="og:title" content="${titleV.replace(/"/g, "&quot;")}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:type" content="website" />\n`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <input className="mb-2 w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={titleV} onChange={(e) => setTitleV(e.target.value)} />
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={url} onChange={(e) => setUrl(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function TwitterCardBuilder89Tool() {
  const [titleV, setTitleV] = useState("Tools");
  const out = `<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${titleV.replace(/"/g, "&quot;")}" />\n`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2" value={titleV} onChange={(e) => setTitleV(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function SchemaValidatorText90Tool() {
  const [t, setT] = useState('{\n  "@context": "https://schema.org",\n  "@type": "Thing"\n}');
  const msg = useMemo(() => {
    try {
      JSON.parse(t);
      return { ok: true, text: "Valid JSON." };
    } catch (e) {
      return { ok: false, text: e instanceof Error ? e.message : "Invalid" };
    }
  }, [t]);
  return (
    <ToolFrame>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className={msg.ok ? "text-emerald-300" : "text-rose-300"}>{msg.text}</p>
    </ToolFrame>
  );
}

export function RssItemCounter91Tool() {
  const [t, setT] = useState("<rss><channel><item/><item/></channel></rss>");
  const n = useMemo(() => (t.match(/<item[\s>]/gi) || []).length, [t]);
  return (
    <ToolFrame>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <p className="text-xl text-cyan-300">&lt;item&gt; count: {n}</p>
    </ToolFrame>
  );
}

export function AtomFeedFormatter92Tool() {
  const [t, setT] = useState('<?xml version="1.0"?><feed></feed>');
  const out = useMemo(() => {
    try {
      const p = new DOMParser();
      const d = p.parseFromString(t, "text/xml");
      return new XMLSerializer().serializeToString(d).replace(/><(\/?)/g, ">\n<$1");
    } catch {
      return t;
    }
  }, [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function CronNextRuns93Tool() {
  const [c, setC] = useState("*/15 * * * *");
  const note = useMemo(() => {
    const p = c.trim().split(/\s+/);
    if (p.length < 5) return "Need 5 cron fields.";
    const [min] = p;
    if (min.startsWith("*/")) {
      const n = +min.slice(2);
      if (!Number.isNaN(n) && n > 0) return `Rough guide: fires every ${n} minutes (simplified; real cron needs timezone & calendar rules).`;
    }
    if (min !== "*" && !min.includes("/")) return `Next-minute field fixed at ${min} — verify with your scheduler in production.`;
    return "Interpretation depends on cron engine; this is a quick hint only.";
  }, [c]);
  return (
    <ToolFrame>
      <input className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono" value={c} onChange={(e) => setC(e.target.value)} />
      <p className="text-slate-300">{note}</p>
    </ToolFrame>
  );
}

export function EpochBatchConvert94Tool() {
  const [t, setT] = useState("1700000000\n1700000000000");
  const out = useMemo(
    () =>
      t
        .split(/\r?\n/)
        .map((line) => {
          const n = +line.trim();
          if (!Number.isFinite(n)) return line;
          const ms = n < 1e12 ? n * 1000 : n;
          return new Date(ms).toISOString();
        })
        .join("\n"),
    [t],
  );
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

function hexToRgbN(hex: string) {
  const h = hex.replace("#", "");
  if (!/^([0-9a-f]{6})$/i.test(h)) return null;
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function mix(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function rgbToHex(rgb: { r: number; g: number; b: number }) {
  return `#${[rgb.r, rgb.g, rgb.b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export function ColorPaletteSteps95Tool() {
  const [hex, setHex] = useState("#3b82f6");
  const [steps, setSteps] = useState(5);
  const palette = useMemo(() => {
    const start = hexToRgbN(hex);
    if (!start) return [];
    const end = { r: 255, g: 255, b: 255 };
    return Array.from({ length: steps }, (_, i) => rgbToHex(mix(start, end, i / Math.max(1, steps - 1))));
  }, [hex, steps]);
  return (
    <ToolFrame actions={<CopyButton text={palette.join("\n")} label="Copy hex list" />}>
      <input className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 font-mono" value={hex} onChange={(e) => setHex(e.target.value)} />
      <label className="text-sm text-slate-400">
        Steps
        <input type="number" min={2} max={12} className="ml-2 w-16 rounded border border-white/15 bg-black/40 px-1" value={steps} onChange={(e) => setSteps(+e.target.value)} />
      </label>
      <div className="flex flex-wrap gap-2">
        {palette.map((h) => (
          <span key={h} className="h-10 w-10 rounded border border-white/20" style={{ backgroundColor: h }} title={h} />
        ))}
      </div>
    </ToolFrame>
  );
}

function relLum(r: number, g: number, b: number) {
  const [R, G, B] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function ContrastRatioQuick96Tool() {
  const [a, setA] = useState("#000000");
  const [b, setB] = useState("#ffffff");
  const ratio = useMemo(() => {
    const A = hexToRgbN(a);
    const B = hexToRgbN(b);
    if (!A || !B) return null;
    const l1 = relLum(A.r, A.g, A.b);
    const l2 = relLum(B.r, B.g, B.b);
    const L1 = Math.max(l1, l2);
    const L2 = Math.min(l1, l2);
    return +((L1 + 0.05) / (L2 + 0.05)).toFixed(2);
  }, [a, b]);
  return (
    <ToolFrame>
      <div className="flex gap-2">
        <input className="flex-1 rounded border border-white/15 bg-black/40 px-3 py-2 font-mono" value={a} onChange={(e) => setA(e.target.value)} />
        <input className="flex-1 rounded border border-white/15 bg-black/40 px-3 py-2 font-mono" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      {ratio !== null && <p className="text-xl text-cyan-300">Contrast ratio: {ratio}:1 (WCAG text needs ~4.5:1 for AA normal)</p>}
    </ToolFrame>
  );
}

export function GradientCssBuilder97Tool() {
  const [c1, setC1] = useState("#3b82f6");
  const [c2, setC2] = useState("#a855f7");
  const [deg, setDeg] = useState(135);
  const out = `background: linear-gradient(${deg}deg, ${c1}, ${c2});`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy CSS" />}>
      <div className="flex flex-wrap gap-2">
        <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} aria-label="Color 1" />
        <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} aria-label="Color 2" />
        <label className="text-slate-300">
          deg
          <input type="number" className="ml-2 w-16 rounded border border-white/15 bg-black/40 px-1" value={deg} onChange={(e) => setDeg(+e.target.value)} />
        </label>
      </div>
      <div className="h-16 w-full rounded-lg border border-white/20" style={{ background: `linear-gradient(${deg}deg, ${c1}, ${c2})` }} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function BoxShadowGenerator98Tool() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(0);
  const [col, setCol] = useState("rgba(0,0,0,0.35)");
  const out = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${col};`;
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy CSS" />}>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 md:grid-cols-5">
        <label>
          x <input type="number" className="w-full rounded border border-white/15 bg-black/40 px-1" value={x} onChange={(e) => setX(+e.target.value)} />
        </label>
        <label>
          y <input type="number" className="w-full rounded border border-white/15 bg-black/40 px-1" value={y} onChange={(e) => setY(+e.target.value)} />
        </label>
        <label>
          blur <input type="number" className="w-full rounded border border-white/15 bg-black/40 px-1" value={blur} onChange={(e) => setBlur(+e.target.value)} />
        </label>
        <label>
          spread <input type="number" className="w-full rounded border border-white/15 bg-black/40 px-1" value={spread} onChange={(e) => setSpread(+e.target.value)} />
        </label>
      </div>
      <input className="w-full rounded border border-white/15 bg-black/40 px-2 py-1 text-sm" value={col} onChange={(e) => setCol(e.target.value)} placeholder="color" />
      <div className="flex h-24 items-center justify-center rounded-xl bg-white/5">
        <div className="h-12 w-24 rounded-lg bg-cyan-600" style={{ boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${col}` }} />
      </div>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function FlexboxCheatSheet99Tool() {
  return (
    <ToolFrame>
      <div className="max-h-[28rem] space-y-4 overflow-y-auto text-sm text-slate-300">
        <section>
          <h3 className="font-semibold text-white">Container</h3>
          <ul className="list-disc pl-5">
            <li>
              <code className="text-cyan-200">display: flex</code> — flex container
            </li>
            <li>
              <code className="text-cyan-200">flex-direction</code>: row | column | row-reverse | column-reverse
            </li>
            <li>
              <code className="text-cyan-200">flex-wrap</code>: nowrap | wrap | wrap-reverse
            </li>
            <li>
              <code className="text-cyan-200">justify-content</code>: flex-start | center | flex-end | space-between | space-around | space-evenly
            </li>
            <li>
              <code className="text-cyan-200">align-items</code>: stretch | flex-start | center | flex-end | baseline
            </li>
            <li>
              <code className="text-cyan-200">align-content</code> — multi-line cross-axis
            </li>
            <li>
              <code className="text-cyan-200">gap</code> — spacing between items
            </li>
          </ul>
        </section>
        <section>
          <h3 className="font-semibold text-white">Items</h3>
          <ul className="list-disc pl-5">
            <li>
              <code className="text-cyan-200">flex-grow</code>, <code className="text-cyan-200">flex-shrink</code>, <code className="text-cyan-200">flex-basis</code>
            </li>
            <li>
              <code className="text-cyan-200">flex</code>: shorthand (e.g. <code className="text-cyan-200">1 1 auto</code>)
            </li>
            <li>
              <code className="text-cyan-200">align-self</code> — override on one item
            </li>
            <li>
              <code className="text-cyan-200">order</code> — visual order
            </li>
          </ul>
        </section>
      </div>
    </ToolFrame>
  );
}

