import { posts } from "@/data/blog/posts";
import { blogCategories } from "@/data/blog/categories";
import type { BlogCategoryId, BlogPost, HeadingBlock } from "@/data/blog/types";

export const PAGE_SIZE = 9;
export const RELATED_COUNT = 3;

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPublishedPosts(): BlogPost[] {
  return posts
    .filter((post) => post.status === "published")
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function isValidCategory(category: string | undefined): category is BlogCategoryId {
  if (!category) return false;
  return blogCategories.some((item) => item.id === category);
}

type PostsPageParams = {
  category?: string;
  page?: number;
};

type PostsPageResult = {
  items: BlogPost[];
  total: number;
  totalPages: number;
  page: number;
  category?: BlogCategoryId;
};

export function getPostsPage({ category, page = 1 }: PostsPageParams): PostsPageResult {
  const published = getPublishedPosts();
  const activeCategory = isValidCategory(category) ? category : undefined;
  const filtered = activeCategory
    ? published.filter((post) => post.category === activeCategory)
    : published;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return {
    items,
    total: filtered.length,
    totalPages,
    page: safePage,
    category: activeCategory,
  };
}

export function getRelatedPosts(post: BlogPost, count: number = RELATED_COUNT): BlogPost[] {
  const published = getPublishedPosts().filter((candidate) => candidate.slug !== post.slug);
  const sameCategory = published.filter((candidate) => candidate.category === post.category);
  const others = published.filter((candidate) => candidate.category !== post.category);
  return [...sameCategory, ...others].slice(0, count);
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatPostDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function extractHeadings(post: BlogPost): Array<{ id: string; text: string }> {
  return post.body
    .filter((block): block is HeadingBlock => block.type === "heading" && block.level === 2)
    .map((block) => ({ id: block.id, text: block.text }));
}
