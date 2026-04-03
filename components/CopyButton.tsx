"use client";

import { useCallback, useState } from "react";
import { btnGhost } from "@/components/tools/tool-ui";

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [hint, setHint] = useState<"idle" | "ok" | "err">("idle");

  const onCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setHint("ok");
      window.setTimeout(() => setHint("idle"), 2000);
    } catch {
      setHint("err");
      window.setTimeout(() => setHint("idle"), 2500);
    }
  }, [text]);

  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <button
        type="button"
        className={`${btnGhost} text-xs sm:text-sm`}
        onClick={onCopy}
        disabled={!text}
      >
        {label}
      </button>
      <span className="min-h-[1.25rem] text-xs text-slate-600 dark:text-slate-400" aria-live="polite">
        {hint === "ok" ? "Copied." : hint === "err" ? "Could not copy." : ""}
      </span>
    </span>
  );
}
