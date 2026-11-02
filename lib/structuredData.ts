import { siteUrl } from "@/lib/site";
import { blogAuthors } from "@/data/blog/authors";
import type { BlogPost } from "@/data/blog/types";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${siteUrl}${item.url}` } : {}),
    })),
  };
}

export function buildArticleJsonLd(post: BlogPost) {
  const author = blogAuthors[post.authorId];

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    image: `${siteUrl}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
    },
    publisher: {
      "@type": "LegalService",
      name: author.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };
}
