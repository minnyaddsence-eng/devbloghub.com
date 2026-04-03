"use client";

import dynamic from "next/dynamic";
import type { ToolDef } from "@/lib/types";
import { EXTRA_TOOL_REGISTRY } from "@/components/tools/extraToolsRegistry";
import { PlaceholderTool } from "@/components/tools/PlaceholderTool";

const JsonFormatterTool = dynamic(() =>
  import("@/components/tools/JsonFormatterTool").then((m) => m.JsonFormatterTool),
);
const JsonValidatorTool = dynamic(() =>
  import("@/components/tools/JsonValidatorTool").then((m) => m.JsonValidatorTool),
);
const Base64Tool = dynamic(() => import("@/components/tools/Base64Tool").then((m) => m.Base64Tool));
const UrlEncodeTool = dynamic(() => import("@/components/tools/UrlEncodeTool").then((m) => m.UrlEncodeTool));
const UuidTool = dynamic(() => import("@/components/tools/UuidTool").then((m) => m.UuidTool));
const PasswordTool = dynamic(() => import("@/components/tools/PasswordTool").then((m) => m.PasswordTool));
const WordCounterTool = dynamic(() =>
  import("@/components/tools/WordCounterTool").then((m) => m.WordCounterTool),
);
const CaseConverterTool = dynamic(() =>
  import("@/components/tools/CaseConverterTool").then((m) => m.CaseConverterTool),
);
const SlugTool = dynamic(() => import("@/components/tools/SlugTool").then((m) => m.SlugTool));
const TimestampTool = dynamic(() => import("@/components/tools/TimestampTool").then((m) => m.TimestampTool));
const JwtTool = dynamic(() => import("@/components/tools/JwtTool").then((m) => m.JwtTool));

export function ToolRunner({ tool }: { tool: ToolDef }) {
  switch (tool.slug) {
    case "json-formatter":
      return <JsonFormatterTool />;
    case "json-validator":
      return <JsonValidatorTool />;
    case "base64":
      return <Base64Tool />;
    case "url-encode":
      return <UrlEncodeTool />;
    case "uuid-generator":
      return <UuidTool />;
    case "password-generator":
      return <PasswordTool />;
    case "word-counter":
      return <WordCounterTool />;
    case "case-converter":
      return <CaseConverterTool />;
    case "slug-generator":
      return <SlugTool />;
    case "timestamp-converter":
      return <TimestampTool />;
    case "jwt-decoder":
      return <JwtTool />;
    default: {
      const Extra = EXTRA_TOOL_REGISTRY[tool.slug];
      if (Extra) return <Extra />;
      return <PlaceholderTool tool={tool} />;
    }
  }
}
