"use client";

import { useMemo, useState } from "react";
import { CopyButton, ToolFrame, btnClass, btnGhost, inputClass } from "@/components/tools/impl/_shared";

export function TextReverse31Tool() {
  const [t, setT] = useState("DevBlogHub");
  const out = useMemo(() => [...t].reverse().join(""), [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function LineSortDedupe32Tool() {
  const [t, setT] = useState("b\na\nb\nc");
  const [dedupe, setDedupe] = useState(true);
  const out = useMemo(() => {
    let lines = t.split(/\r?\n/);
    if (dedupe) lines = [...new Set(lines)];
    return lines.sort((a, b) => a.localeCompare(b)).join("\n");
  }, [t, dedupe]);
  return (
    <ToolFrame
      actions={
        <>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} />
            Dedupe
          </label>
          <CopyButton text={out} label="Copy" />
        </>
      }
    >
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function EmailExtractor33Tool() {
  const [t, setT] = useState("Contact ada@example.com or bob@test.co");
  const emails = useMemo(() => [...t.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)].map((m) => m[0]), [t]);
  return (
    <ToolFrame actions={<CopyButton text={emails.join("\n")} label="Copy all" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <ul className="list-disc pl-6 text-sm text-cyan-200">
        {emails.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </ToolFrame>
  );
}

export function DuplicateLineRemover34Tool() {
  const [t, setT] = useState("a\nb\na\nc\nb");
  const out = useMemo(() => [...new Set(t.split(/\r?\n/))].join("\n"), [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function WhitespaceTrimmer35Tool() {
  const [t, setT] = useState("  x \n y \n");
  const out = useMemo(() => t.split(/\r?\n/).map((l) => l.trim()).join("\n"), [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function FindReplaceBatch36Tool() {
  const [t, setT] = useState("foo bar foo");
  const [find, setFind] = useState("foo");
  const [repl, setRepl] = useState("baz");
  const out = useMemo(() => t.split(find).join(repl), [t, find, repl]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <div className="flex flex-wrap gap-2">
        <input className="rounded border border-white/15 bg-black/40 px-2 py-1" value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find" />
        <input className="rounded border border-white/15 bg-black/40 px-2 py-1" value={repl} onChange={(e) => setRepl(e.target.value)} placeholder="Replace" />
      </div>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function AsciiBorder37Tool() {
  const [t, setT] = useState("DevBlogHub");
  const out = useMemo(() => {
    const lines = t.split("\n");
    const w = Math.max(...lines.map((l) => l.length), 1);
    const bar = `+${"-".repeat(w + 2)}+`;
    const body = lines.map((l) => `| ${l.padEnd(w)} |`).join("\n");
    return `${bar}\n${body}\n${bar}`;
  }, [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function NumberBaseConverter38Tool() {
  const [num, setNum] = useState("255");
  const [from, setFrom] = useState(10);
  const [to, setTo] = useState(16);
  const out = useMemo(() => {
    try {
      const n = parseInt(num, from);
      if (Number.isNaN(n)) return "";
      return n.toString(to);
    } catch {
      return "";
    }
  }, [num, from, to]);
  return (
    <ToolFrame actions={out ? <CopyButton text={out} label="Copy result" /> : null}>
      <div className="flex flex-wrap gap-2 text-sm">
        <input className="rounded border border-white/15 bg-black/40 px-2 py-1 font-mono" value={num} onChange={(e) => setNum(e.target.value)} />
        <label className="text-slate-300">
          From
          <input type="number" min={2} max={36} className="ml-1 w-14 rounded border border-white/15 bg-black/40 px-1" value={from} onChange={(e) => setFrom(+e.target.value)} />
        </label>
        <label className="text-slate-300">
          To
          <input type="number" min={2} max={36} className="ml-1 w-14 rounded border border-white/15 bg-black/40 px-1" value={to} onChange={(e) => setTo(+e.target.value)} />
        </label>
      </div>
      {out && <p className="font-mono text-cyan-300">{out}</p>}
    </ToolFrame>
  );
}

export function BinaryDecimalConverter39Tool() {
  const [mode, setMode] = useState<"bd" | "db">("bd");
  const [v, setV] = useState("1010");
  const out = useMemo(() => {
    try {
      if (mode === "bd") {
        const n = parseInt(v.replace(/\s/g, ""), 2);
        return Number.isNaN(n) ? "" : String(n);
      }
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? "" : n.toString(2);
    } catch {
      return "";
    }
  }, [v, mode]);
  return (
    <ToolFrame
      actions={
        <>
          <button className={mode === "bd" ? btnClass : btnGhost} onClick={() => setMode("bd")}>
            Binary → decimal
          </button>
          <button className={mode === "db" ? btnClass : btnGhost} onClick={() => setMode("db")}>
            Decimal → binary
          </button>
          {out ? <CopyButton text={out} label="Copy" /> : null}
        </>
      }
    >
      <input className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono" value={v} onChange={(e) => setV(e.target.value)} />
      {out && <p className="font-mono text-xl text-cyan-300">{out}</p>}
    </ToolFrame>
  );
}

export function IpSubnetCalculator40Tool() {
  const [cidr, setCidr] = useState("192.168.1.0/24");
  const info = useMemo(() => {
    const m = cidr.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
    if (!m) return { kind: "err" as const, message: "Use IPv4 CIDR e.g. 192.168.0.0/24" };
    const ip = m[1].split(".").map((x) => +x);
    const pfx = +m[2];
    if (ip.some((n) => n > 255) || pfx < 0 || pfx > 32) return { kind: "err" as const, message: "Invalid address or prefix" };
    const addr = (ip[0] << 24) | (ip[1] << 16) | (ip[2] << 8) | ip[3];
    const mask = pfx === 0 ? 0 : (~0 << (32 - pfx)) >>> 0;
    const net = (addr & mask) >>> 0;
    const broad = (net | (~mask >>> 0)) >>> 0;
    const fmt = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    const hosts = pfx >= 31 ? 0 : 2 ** (32 - pfx) - 2;
    return { kind: "ok" as const, network: fmt(net), broadcast: fmt(broad), hosts };
  }, [cidr]);

  return (
    <ToolFrame>
      <input className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono" value={cidr} onChange={(e) => setCidr(e.target.value)} />
      {info.kind === "err" ? (
        <p className="text-rose-300">{info.message}</p>
      ) : (
        <pre className="text-sm text-slate-300">
          Network: {info.network}
          {"\n"}
          Broadcast: {info.broadcast}
          {"\n"}
          Usable host addresses (approx): {info.hosts}
        </pre>
      )}
    </ToolFrame>
  );
}

export function UserAgentParser41Tool() {
  const [ua, setUa] = useState(typeof navigator !== "undefined" ? navigator.userAgent : "Mozilla/5.0");
  const hint = useMemo(() => {
    let browser = "unknown";
    if (/Edg\//.test(ua)) browser = "Edge";
    else if (/Chrome\//.test(ua) && !/Edg/.test(ua)) browser = "Chrome";
    else if (/Firefox\//.test(ua)) browser = "Firefox";
    else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
    let os = "unknown";
    if (/Windows NT/.test(ua)) os = "Windows";
    else if (/Mac OS X/.test(ua)) os = "macOS";
    else if (/Linux/.test(ua)) os = "Linux";
    else if (/Android/.test(ua)) os = "Android";
    else if (/iPhone|iPad/.test(ua)) os = "iOS";
    return `Browser (heuristic): ${browser}\nOS (heuristic): ${os}`;
  }, [ua]);
  return (
    <ToolFrame actions={<CopyButton text={hint} label="Copy summary" />}>
      <textarea className={inputClass} value={ua} onChange={(e) => setUa(e.target.value)} />
      <pre className="whitespace-pre-wrap text-slate-300">{hint}</pre>
    </ToolFrame>
  );
}

const MIME_MAP: Record<string, string> = {
  json: "application/json",
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  txt: "text/plain",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  pdf: "application/pdf",
  zip: "application/zip",
  xml: "application/xml",
};

export function MimeTypeLookup42Tool() {
  const [ext, setExt] = useState("json");
  const mt = useMemo(() => MIME_MAP[ext.replace(/^\./, "").toLowerCase()] ?? "(unknown)", [ext]);
  return (
    <ToolFrame>
      <input className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3" value={ext} onChange={(e) => setExt(e.target.value)} placeholder="extension" />
      <p className="text-cyan-300">{mt}</p>
    </ToolFrame>
  );
}

const HTTP_MSG: Record<number, string> = {
  200: "OK",
  201: "Created",
  301: "Moved Permanently",
  302: "Found",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

export function HttpStatusLookup43Tool() {
  const [code, setCode] = useState("404");
  const n = parseInt(code, 10);
  const msg = HTTP_MSG[n] ?? "— lookup common codes only; see IANA registry for full list.";
  return (
    <ToolFrame>
      <input type="number" className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3" value={code} onChange={(e) => setCode(e.target.value)} />
      <p className="text-lg text-slate-200">
        {n}: {msg}
      </p>
    </ToolFrame>
  );
}

export function MarkdownTableGenerator44Tool() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const out = useMemo(() => {
    const header = `| ${Array.from({ length: cols }, (_, i) => `Col ${i + 1}`).join(" | ")} |`;
    const sep = `| ${Array.from({ length: cols }, () => "---").join(" | ")} |`;
    const body = Array.from({ length: rows - 1 }, (_, r) => `| ${Array.from({ length: cols }, (_, c) => `r${r + 1}c${c + 1}`).join(" | ")} |`).join("\n");
    return `${header}\n${sep}\n${body}`;
  }, [rows, cols]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy table" />}>
      <div className="flex gap-4 text-sm text-slate-300">
        <label>
          Rows
          <input type="number" min={2} max={30} className="ml-2 w-16 rounded border border-white/15 bg-black/40 px-1" value={rows} onChange={(e) => setRows(+e.target.value)} />
        </label>
        <label>
          Cols
          <input type="number" min={1} max={12} className="ml-2 w-16 rounded border border-white/15 bg-black/40 px-1" value={cols} onChange={(e) => setCols(+e.target.value)} />
        </label>
      </div>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

function jsonPathGet(obj: unknown, path: string): unknown {
  if (!path.startsWith("$")) return undefined;
  let cur: unknown = obj;
  const rest = path.slice(1);
  const tok = rest.match(/(\.[a-zA-Z_][a-zA-Z0-9_]*)|(\[\d+\])/g);
  if (!tok) return cur;
  for (const t of tok) {
    if (cur === null || cur === undefined) return undefined;
    if (t.startsWith(".")) cur = (cur as Record<string, unknown>)[t.slice(1)];
    else cur = (cur as unknown[])[+t.slice(1, -1)];
  }
  return cur;
}

export function JsonPathTester45Tool() {
  const [json, setJson] = useState('{"a":{"b":[1,2,3]}}');
  const [path, setPath] = useState("$.a.b[1]");
  const out = useMemo(() => {
    try {
      const o = JSON.parse(json);
      return JSON.stringify(jsonPathGet(o, path.trim()), null, 2);
    } catch (e) {
      return e instanceof Error ? e.message : "error";
    }
  }, [json, path]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy result" />}>
      <input className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 font-mono" value={path} onChange={(e) => setPath(e.target.value)} placeholder="$.path[0]" />
      <textarea className={inputClass} value={json} onChange={(e) => setJson(e.target.value)} />
      <pre className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-cyan-100">{out}</pre>
    </ToolFrame>
  );
}

export function SqlFormatterLite46Tool() {
  const [t, setT] = useState("select * from users where id=1");
  const out = useMemo(() => {
    const kw = /\b(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET)\b/gi;
    let s = t.replace(/\s+/g, " ").trim();
    s = s.replace(kw, (m) => m.toUpperCase());
    return s.replace(/\bWHERE\b/gi, "\nWHERE ").replace(/\bFROM\b/gi, "\nFROM ").replace(/\bJOIN\b/gi, "\nJOIN ");
  }, [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function GraphqlFormatter47Tool() {
  const [t, setT] = useState("{ hero { id name } }");
  const out = useMemo(() => {
    let pad = 0;
    const step = "  ";
    return t
      .replace(/\s+/g, " ")
      .split(/(\{|\})/)
      .filter(Boolean)
      .map((tok) => {
        if (tok === "}") pad = Math.max(0, pad - 1);
        const line = step.repeat(pad) + tok.trim();
        if (tok === "{") pad++;
        return line;
      })
      .join("\n");
  }, [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}
