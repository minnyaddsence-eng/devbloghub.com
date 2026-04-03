import type { ToolDef } from "@/lib/types";

export type HomeCategoryId = "all" | "developer" | "seo" | "text" | "generators" | "security" | "web";

export const HOME_CATEGORY_TABS: { id: HomeCategoryId; label: string; icon: string }[] = [
  { id: "all", label: "All Tools", icon: "✦" },
  { id: "developer", label: "Developer", icon: "💻" },
  { id: "seo", label: "SEO", icon: "🔍" },
  { id: "text", label: "Text", icon: "📝" },
  { id: "generators", label: "Generators", icon: "⚡" },
  { id: "security", label: "Security", icon: "🛡️" },
  { id: "web", label: "Web", icon: "🌐" },
];

const DEVELOPER_CATEGORIES = new Set(["Dev", "Meta", "Formatters", "Encoders", "Data"]);

export function toolMatchesHomeCategory(tool: ToolDef, tab: HomeCategoryId): boolean {
  if (tab === "all") return true;
  if (tab === "developer") return DEVELOPER_CATEGORIES.has(tool.category);
  if (tab === "seo") return tool.category === "SEO";
  if (tab === "text") return tool.category === "Text";
  if (tab === "generators") return tool.category === "Generators";
  if (tab === "security") return tool.category === "Security";
  if (tab === "web") return tool.category === "Web";
  return true;
}
