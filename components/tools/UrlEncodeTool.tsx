"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { btnClass, btnGhost, inputClass } from "@/components/tools/tool-ui";

export function UrlEncodeTool() {
  const [text, setText] = useState("hello world & safe=1");
  const [out, setOut] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnClass} onClick={() => setOut(encodeURIComponent(text))}>
          Encode component
        </button>
        <button type="button" className={btnGhost} onClick={() => setOut(encodeURI(text))}>
          Encode URI
        </button>
        <button type="button" className={btnGhost} onClick={() => setOut(decodeURIComponent(text))}>
          Decode
        </button>
        {out ? <CopyButton text={out} label="Copy result" /> : null}
      </div>
      <label className="block text-sm text-slate-400">
        Input
        <textarea
          className={`${inputClass} mt-1`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
      </label>
      {out ? (
        <label className="block text-sm text-slate-400">
          Output
          <textarea className={`${inputClass} mt-1`} readOnly value={out} aria-label="Output" />
        </label>
      ) : null}
    </div>
  );
}
