const STORAGE_KEY = "devbloghub-recent-tools";

export function readRecentToolSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string").slice(0, 8);
  } catch {
    return [];
  }
}

export function rememberToolVisit(slug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const prev = readRecentToolSlugs();
    const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 8);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return readRecentToolSlugs();
  }
}
