const CATEGORY_EMOJI: Record<string, string> = {
  Formatters: "🧩",
  Encoders: "🔑",
  Generators: "⚡",
  Security: "🛡️",
  Text: "📝",
  Dev: "💻",
  Data: "📊",
  Web: "🌐",
  SEO: "🔍",
  Meta: "🏷️",
};

export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🔧";
}

/** Stable, display-only engagement hint (not real analytics). */
export function pseudoUses(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const k = 6 + (h % 94);
  return `${k}K+ uses`;
}
