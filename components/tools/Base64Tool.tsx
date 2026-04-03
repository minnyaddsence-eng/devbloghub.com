"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { btnClass, btnGhost, inputClass } from "@/components/tools/tool-ui";

export function Base64Tool() {
  const [text, setText] = useState("DevBlogHub");
  const [out, setOut] = useState("");

  const encode = () => {
    try {
      setOut(btoa(unescape(encodeURIComponent(text))));
    } catch {
      setOut("");
    }
  };

  const decode = () => {
    try {
      setOut(decodeURIComponent(escape(atob(text.trim()))));
    } catch {
      setOut("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnClass} onClick={encode}>
          Encode
        </button>
        <button type="button" className={btnGhost} onClick={decode}>
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
