import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/tools";
import { DEFAULT_USE_CASE_SLUG } from "@/lib/use-cases";

/**
 * Legacy two-segment URLs (/tools/slug/keyword) → canonical three-segment long-tail.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "tools" || segments.length !== 3) {
    return NextResponse.next();
  }

  const [, slug, keyword] = segments;
  const tool = getToolBySlug(slug);
  if (!tool?.seoSlugs.includes(keyword)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/tools/${slug}/${keyword}/${DEFAULT_USE_CASE_SLUG}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/tools/:slug/:keyword"],
};
