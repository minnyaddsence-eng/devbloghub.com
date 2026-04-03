"use client";

import { useMemo, useState } from "react";
import { CopyButton, ToolFrame, btnClass, btnGhost, inputClass } from "@/components/tools/impl/_shared";

export function HtmlMinifierTool() {
  const [t, setT] = useState("<div>  hello  </div>");
  const out = useMemo(
    () => t.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim(),
    [t],
  );
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy minified" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function CssMinifierTool() {
  const [t, setT] = useState("/* c */\n.foo { color: red; \n }");
  const out = useMemo(() => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/;\s*}/g, "}").trim(), [t]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function JsMinifierTool() {
  const [t, setT] = useState("const  x  =  1 ;\n// hi\nconsole.log(x)");
  const out = useMemo(
    () =>
      t
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .trim(),
    [t],
  );
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy (basic)" />}>
      <p className="text-xs text-amber-200/80">Basic whitespace strip only — not safe for all JS.</p>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function RegexTesterTool() {
  const [pat, setPat] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("hello DevBlogHub 99");
  const result = useMemo(() => {
    try {
      const re = new RegExp(pat, flags.replace(/[^gimsuy]/g, ""));
      const m = [...text.matchAll(re)];
      return { ok: true as const, m };
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : "bad pattern" };
    }
  }, [pat, flags, text]);

  return (
    <ToolFrame>
      <div className="flex flex-wrap gap-2">
        <input
          className="flex-1 min-w-[120px] rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm"
          value={pat}
          onChange={(e) => setPat(e.target.value)}
          aria-label="Pattern"
        />
        <input
          className="w-20 rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          aria-label="Flags"
        />
      </div>
      {!result.ok ? (
        <p className="text-rose-300" role="alert">
          {result.err}
        </p>
      ) : (
        <p className="text-emerald-300 text-sm" role="status">
          {result.m.length} match{result.m.length !== 1 ? "es" : ""}
        </p>
      )}
      <textarea className={inputClass} value={text} onChange={(e) => setText(e.target.value)} />
      {result.ok && (
        <pre className="max-h-48 overflow-auto rounded-xl border border-slate-200 bg-slate-950 dark:border-white/10 dark:bg-black/40 p-3 text-xs text-emerald-100 dark:text-cyan-100">
          {JSON.stringify(result.m.map((x) => x[0]), null, 2)}
        </pre>
      )}
    </ToolFrame>
  );
}

function hexToRgb(h: string) {
  const x = h.replace("#", "");
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(x)) return null;
  const v = x.length === 3 ? x.split("").map((c) => c + c).join("") : x;
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorConverterTool() {
  const [hex, setHex] = useState("#3b82f6");
  const info = useMemo(() => {
    const rgb = hexToRgb(hex.trim());
    if (!rgb) return { err: "Invalid hex" as const };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      err: null as null,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }, [hex]);

  return (
    <ToolFrame
      actions={
        info.err ? null : (
          <>
            <CopyButton text={info.rgb!} label="Copy RGB" />
            <CopyButton text={info.hsl!} label="Copy HSL" />
          </>
        )
      }
    >
      <input
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        aria-label="Hex color"
      />
      {info.err ? (
        <p className="text-rose-300">{info.err}</p>
      ) : (
        <div className="flex flex-wrap gap-4 text-sm">
          <span
            className="h-12 w-12 rounded-lg border border-white/20"
            style={{ backgroundColor: hex.startsWith("#") ? hex : `#${hex}` }}
          />
          <p className="text-slate-700 dark:text-slate-300">
            {info.rgb}
            <br />
            {info.hsl}
          </p>
        </div>
      )}
    </ToolFrame>
  );
}

export function MarkdownPreviewTool() {
  const [md, setMd] = useState("# Hello\n\n**bold** and `code`");
  const html = useMemo(() => {
    return md
      .split("\n")
      .map((line) => {
        let s = line
          .replace(/^### (.+)$/, "<h3 class=\"text-lg font-semibold mt-3\">$1</h3>")
          .replace(/^## (.+)$/, "<h2 class=\"text-xl font-semibold mt-3\">$1</h2>")
          .replace(/^# (.+)$/, "<h1 class=\"text-2xl font-bold mt-3\">$1</h1>");
        if (!s.startsWith("<h")) {
          s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code class=\"bg-black/40 px-1 rounded\">$1</code>");
          if (s.trim()) s = `<p class="my-2">${s}</p>`;
        }
        return s;
      })
      .join("");
  }, [md]);

  return (
    <ToolFrame>
      <div className="grid gap-4 md:grid-cols-2">
        <textarea className={inputClass} value={md} onChange={(e) => setMd(e.target.value)} />
        <div
          className="min-h-[200px] rounded-xl border border-slate-200 bg-white p-4 text-slate-800 [&_a]:text-sky-700 [&_code]:text-sky-800 dark:border-white/10 dark:bg-black/30 dark:text-slate-200 dark:[&_a]:text-sky-700 dark:text-cyan-300 dark:[&_code]:text-cyan-200"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </ToolFrame>
  );
}

export function TextDiffTool() {
  const [a, setA] = useState("line1\nline2\nline3");
  const [b, setB] = useState("line1\nline2 changed\nline3");
  const rows = useMemo(() => {
    const la = a.split("\n");
    const lb = b.split("\n");
    const max = Math.max(la.length, lb.length);
    const out: { type: "eq" | "chg"; left?: string; right?: string }[] = [];
    for (let i = 0; i < max; i++) {
      const x = la[i] ?? "";
      const y = lb[i] ?? "";
      out.push(x === y ? { type: "eq", left: x } : { type: "chg", left: x, right: y });
    }
    return out;
  }, [a, b]);

  return (
    <ToolFrame>
      <div className="grid gap-4 md:grid-cols-2">
        <textarea className={inputClass} value={a} onChange={(e) => setA(e.target.value)} />
        <textarea className={inputClass} value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      <div className="max-h-64 overflow-auto rounded-xl border border-slate-200 font-mono text-xs dark:border-white/10">
        {rows.map((r, i) =>
          r.type === "eq" ? (
            <div key={i} className="border-b border-slate-200 px-2 py-0.5 text-slate-600 dark:border-white/5 dark:text-slate-400">
              {r.left}
            </div>
          ) : (
            <div key={i} className="border-b border-slate-200 dark:border-white/5">
              <div className="bg-rose-100 px-2 py-0.5 text-red-800 dark:bg-rose-500/20 dark:text-red-200">- {r.left}</div>
              <div className="bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">+ {r.right}</div>
            </div>
          ),
        )}
      </div>
    </ToolFrame>
  );
}

export function RandomNumberTool() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [n, setN] = useState<number | null>(null);
  const roll = () => {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    setN(lo + Math.floor(Math.random() * (hi - lo + 1)));
  };

  return (
    <ToolFrame actions={<button className={btnClass} onClick={roll}>Roll</button>}>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          Min
          <input type="number" className="w-24 rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 dark:border-white/15 dark:bg-black/40 dark:text-slate-100" value={min} onChange={(e) => setMin(+e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          Max
          <input type="number" className="w-24 rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 dark:border-white/15 dark:bg-black/40 dark:text-slate-100" value={max} onChange={(e) => setMax(+e.target.value)} />
        </label>
      </div>
      {n !== null && <p className="text-2xl font-bold text-sky-700 dark:text-cyan-300">{n}</p>}
    </ToolFrame>
  );
}

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export function LoremIpsumTool() {
  const [p, setP] = useState(3);
  const out = useMemo(() => Array.from({ length: p }, () => LOREM).join("\n\n"), [p]);
  return (
    <ToolFrame actions={<CopyButton text={out} label="Copy" />}>
      <label className="text-sm text-slate-400">
        Paragraphs
        <input type="number" min={1} max={50} className="ml-2 w-20 rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 dark:border-white/15 dark:bg-black/40 dark:text-slate-100" value={p} onChange={(e) => setP(+e.target.value)} />
      </label>
      <textarea className={inputClass} readOnly value={out} />
    </ToolFrame>
  );
}

export function HashGeneratorTool() {
  const [t, setT] = useState("DevBlogHub");
  const [out, setOut] = useState("");
  const hash = async () => {
    const enc = new TextEncoder().encode(t);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    setOut(
      [...new Uint8Array(buf)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    );
  };
  return (
    <ToolFrame actions={<button className={btnClass} onClick={hash}>SHA-256</button>}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      {out && (
        <div className="flex items-start gap-2">
          <textarea className={inputClass} readOnly value={out} />
          <CopyButton text={out} label="Copy" />
        </div>
      )}
    </ToolFrame>
  );
}

export function CsvToJsonTool() {
  const [t, setT] = useState("name,age\nAda,36\nBob,29");
  const [out, setOut] = useState("");
  const run = () => {
    try {
      const lines = t.trim().split(/\r?\n/).filter(Boolean);
      if (!lines.length) {
        setOut("[]");
        return;
      }
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const cells = line.split(",").map((c) => c.trim());
        const o: Record<string, string> = {};
        headers.forEach((h, i) => {
          o[h] = cells[i] ?? "";
        });
        return o;
      });
      setOut(JSON.stringify(rows, null, 2));
    } catch {
      setOut('{"error":"parse failed"}');
    }
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={run}>Convert</button>{out ? <CopyButton text={out} label="Copy JSON" /> : null}</>}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      {out && <textarea className={inputClass} readOnly value={out} />}
    </ToolFrame>
  );
}

export function JsonToCsvTool() {
  const [t, setT] = useState('[{"a":1,"b":2},{"a":3,"b":4}]');
  const [out, setOut] = useState("");
  const run = () => {
    try {
      const data = JSON.parse(t) as Record<string, unknown>[];
      if (!Array.isArray(data) || !data.length) {
        setOut("");
        return;
      }
      const keys = Object.keys(data[0]);
      const esc = (v: unknown) => {
        const s = String(v ?? "");
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      setOut([keys.join(","), ...data.map((row) => keys.map((k) => esc(row[k])).join(","))].join("\n"));
    } catch {
      setOut("");
    }
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={run}>Convert</button>{out ? <CopyButton text={out} label="Copy CSV" /> : null}</>}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      {out && <textarea className={inputClass} readOnly value={out} />}
    </ToolFrame>
  );
}

export function QueryStringParserTool() {
  const [t, setT] = useState("https://ex.com/?foo=1&bar=two%20words");
  const [buildKey, setBuildKey] = useState("sort");
  const [buildVal, setBuildVal] = useState("date");
  const parsed = useMemo(() => {
    try {
      const u = t.includes("://") ? new URL(t) : new URL(`https://dummy.local/?${t}`);
      return Object.fromEntries(u.searchParams.entries());
    } catch {
      return {};
    }
  }, [t]);
  const built = useMemo(() => {
    const p = new URLSearchParams();
    Object.entries(parsed).forEach(([k, v]) => p.set(k, v));
    if (buildKey) p.set(buildKey, buildVal);
    return p.toString();
  }, [parsed, buildKey, buildVal]);

  return (
    <ToolFrame actions={<CopyButton text={JSON.stringify(parsed, null, 2)} label="Copy JSON" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <pre className="rounded-xl border border-slate-200 bg-slate-950 dark:border-white/10 dark:bg-black/40 p-3 text-xs text-emerald-100 dark:text-cyan-100">{JSON.stringify(parsed, null, 2)}</pre>
      <div className="flex flex-wrap gap-2 text-sm">
        <input className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 dark:border-white/15 dark:bg-black/40 dark:text-slate-100" value={buildKey} onChange={(e) => setBuildKey(e.target.value)} placeholder="key" />
        <input className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 dark:border-white/15 dark:bg-black/40 dark:text-slate-100" value={buildVal} onChange={(e) => setBuildVal(e.target.value)} placeholder="value" />
      </div>
      <p className="text-sm text-slate-400">Built string: {built}</p>
    </ToolFrame>
  );
}

export function HtmlEntitiesTool() {
  const [t, setT] = useState('<div title="a&b">');
  const enc = () => {
    const ta = document.createElement("textarea");
    ta.textContent = t;
    setT(ta.innerHTML);
  };
  const dec = () => {
    const ta = document.createElement("textarea");
    ta.innerHTML = t;
    setT(ta.value);
  };
  return (
    <ToolFrame actions={<><button className={btnClass} onClick={enc}>Encode</button><button className={btnGhost} onClick={dec}>Decode</button><CopyButton text={t} label="Copy" /></>}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
    </ToolFrame>
  );
}

export function Rot13Tool() {
  const rot = (s: string) =>
    s.replace(/[a-zA-Z]/g, (c) => {
      const code = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - code + 13) % 26) + code);
    });
  const [t, setT] = useState("DevBlogHub");
  return (
    <ToolFrame actions={<CopyButton text={rot(t)} label="Copy ROT13" />}>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={rot(t)} />
    </ToolFrame>
  );
}

export function HexEncodeTool() {
  const [t, setT] = useState("Hi");
  const enc = useMemo(() => [...new TextEncoder().encode(t)].map((b) => b.toString(16).padStart(2, "0")).join(""), [t]);
  const [decOut, setDecOut] = useState("");
  const decodeHex = () => {
    try {
      const s = enc.replace(/\s/g, "");
      if (s.length % 2) throw new Error("odd length");
      const bytes = new Uint8Array(s.match(/.{2}/g)!.map((x) => parseInt(x, 16)));
      setDecOut(new TextDecoder().decode(bytes));
    } catch {
      setDecOut("(invalid hex)");
    }
  };
  return (
    <ToolFrame
      actions={
        <>
          <CopyButton text={enc} label="Copy hex" />
          <button className={btnGhost} onClick={decodeHex}>
            Decode hex → text
          </button>
        </>
      }
    >
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      <textarea className={inputClass} readOnly value={enc} />
      {decOut && <p className="text-sm text-slate-700 dark:text-slate-300">{decOut}</p>}
    </ToolFrame>
  );
}

export function XmlFormatterTool() {
  const [t, setT] = useState("<root><item id='1'>a</item></root>");
  const out = useMemo(() => {
    try {
      const p = new DOMParser();
      const d = p.parseFromString(t, "text/xml");
      if (d.querySelector("parsererror")) throw new Error("parse");
      const ser = new XMLSerializer();
      const raw = ser.serializeToString(d);
      let pad = 0;
      const step = "  ";
      return raw
        .replace(/></g, ">\n<")
        .split("\n")
        .map((line) => {
          const m = line.match(/^<\//);
          if (m) pad = Math.max(0, pad - 1);
          const ind = step.repeat(pad);
          if (!line.match(/^<\?/) && !m && !line.endsWith("/>") && line.match(/^<[^!/?][^>]*[^/]>$/)) pad++;
          return ind + line.trim();
        })
        .join("\n");
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

export function YamlToJsonTool() {
  const [t, setT] = useState("name: DevBlogHub\nversion: 1\nitems:\n  - a\n  - b");
  const [out, setOut] = useState("");
  const run = () => {
    try {
      const lines = t.split(/\r?\n/);
      const root: Record<string, unknown> = {};
      let stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: root, indent: -1 }];

      const parseVal = (v: string) => {
        if (v === "true") return true;
        if (v === "false") return false;
        if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
        return v;
      };

      for (const line of lines) {
        if (!line.trim() || line.trim().startsWith("#")) continue;
        const indent = line.match(/^(\s*)/)![1].length;
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();

        if (line.trim().startsWith("- ")) {
          const item = line.trim().slice(2);
          const arrKey = "__arr__";
          const parent = stack[stack.length - 1].obj;
          let arr = parent[arrKey] as unknown[];
          if (!arr) {
            arr = [];
            parent[arrKey] = arr;
          }
          arr.push(parseVal(item));
          continue;
        }

        const m = line.match(/^(\s*)([^:]+):\s*(.*)$/);
        if (!m) continue;
        const key = m[2].trim();
        const rest = m[3].trim();
        const cur = stack[stack.length - 1].obj;

        if (!rest) {
          const child: Record<string, unknown> = {};
          cur[key] = child;
          stack.push({ obj: child, indent });
        } else {
          cur[key] = parseVal(rest);
        }
      }
      if (root.__arr__) {
        setOut(JSON.stringify(root.__arr__, null, 2));
      } else {
        delete root.__arr__;
        setOut(JSON.stringify(root, null, 2));
      }
    } catch {
      setOut("{}");
    }
  };

  return (
    <ToolFrame actions={<><button className={btnClass} onClick={run}>Convert (simple YAML)</button>{out ? <CopyButton text={out} label="Copy" /> : null}</>}>
      <p className="text-xs text-amber-200/80">Supports flat maps, simple lists with -, and booleans/numbers.</p>
      <textarea className={inputClass} value={t} onChange={(e) => setT(e.target.value)} />
      {out && <textarea className={inputClass} readOnly value={out} />}
    </ToolFrame>
  );
}

export function CronExplainerTool() {
  const [c, setC] = useState("0 9 * * 1-5");
  const explain = useMemo(() => {
    const p = c.trim().split(/\s+/);
    if (p.length < 5) return "Enter 5 cron fields: min hour dom mon dow";
    const [min, hour, dom, mon, dow] = p;
    return `Minute: ${min}, Hour: ${hour}, Day of month: ${dom}, Month: ${mon}, Day of week: ${dow} (0 Sun). Typical: job runs when all fields match.`;
  }, [c]);

  return (
    <ToolFrame actions={<CopyButton text={explain} label="Copy summary" />}>
      <input className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono" value={c} onChange={(e) => setC(e.target.value)} />
      <p className="text-slate-700 dark:text-slate-300">{explain}</p>
    </ToolFrame>
  );
}

export function JsonMinifier30Tool() {
  const [raw, setRaw] = useState('{\n  "x": 1\n}');
  const out = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(raw));
    } catch {
      return "";
    }
  }, [raw]);
  return (
    <ToolFrame actions={<>{out ? <CopyButton text={out} label="Copy minified" /> : null}</>}>
      <textarea className={inputClass} value={raw} onChange={(e) => setRaw(e.target.value)} />
      {out && <textarea className={inputClass} readOnly value={out} />}
      {!out && raw.trim() && <p className="text-rose-300">Invalid JSON</p>}
    </ToolFrame>
  );
}
