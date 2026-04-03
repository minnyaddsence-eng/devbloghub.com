import blogData from "@/data/blog.json";
import type { BlogPost } from "@/lib/types";

const posts = blogData as BlogPost[];

export function getPosts(): BlogPost[] {
  return posts;
}

export function getSortedPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export const BLOG_PAGE_SIZE = 8;

export function getBlogPageSlice(page: number): { items: BlogPost[]; totalPages: number; page: number } {
  const sorted = getSortedPosts();
  const totalPages = Math.max(1, Math.ceil(sorted.length / BLOG_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * BLOG_PAGE_SIZE;
  return {
    items: sorted.slice(start, start + BLOG_PAGE_SIZE),
    totalPages,
    page: safePage,
  };
}
