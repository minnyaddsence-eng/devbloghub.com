"use client";

import { useState } from "react";
import { btnGhost, inputClass } from "@/components/tools/tool-ui";

const toCamel = (s: string) => {
  const parts = s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return parts.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))).join("");
};

const toSnake = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

const toKebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const toTitle = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function CaseConverterTool() {
  const [text, setText] = useState("hello DevBlogHub case");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnGhost} onClick={() => setText((t) => t.toUpperCase())}>
          UPPER
        </button>
        <button type="button" className={btnGhost} onClick={() => setText((t) => t.toLowerCase())}>
          lower
        </button>
        <button type="button" className={btnGhost} onClick={() => setText((t) => toTitle(t))}>
          Title Case
        </button>
        <button type="button" className={btnGhost} onClick={() => setText((t) => toCamel(t))}>
          camelCase
        </button>
        <button type="button" className={btnGhost} onClick={() => setText((t) => toSnake(t))}>
          snake_case
        </button>
        <button type="button" className={btnGhost} onClick={() => setText((t) => toKebab(t))}>
          kebab-case
        </button>
      </div>
      <textarea className={inputClass} value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
