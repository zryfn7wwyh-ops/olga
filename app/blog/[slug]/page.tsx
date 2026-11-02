import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, getBlogBreadcrumbItems } from "@/components/blog/Breadcrumbs";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleCommercialCta } from "@/components/blog/ArticleCommercialCta";
import { ArticleFinalCta } from "@/components/blog/ArticleFinalCta";
import { AuthorBlock } from "@/components/blog/AuthorBlock";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ArticleViewTracker } from "@/components/blog/ArticleViewTracker";
import { CalendarIcon } from "@/components/ui/icons";
import { getAllPosts, getPostBySlug, getRelatedPosts, extractHeadings, formatPostDate } from "@/lib/blog";
import { getCategoryLabel } from "@/data/blog/categories";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/structuredData";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const isDraft = post.status === "draft";

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: post.canonical ?? `/blog/${post.slug}` },
    robots: isDraft ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [{ url: post.coverImage, alt: post.coverImageAlt }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post);
  const related = getRelatedPosts(post);
  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbItems = getBlogBreadcrumbItems(post.title);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"

        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"

        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleViewTracker slug={post.slug} />
      <Header />
      <main className="flex-1 bg-paper pb-16 pt-28 lg:pb-24">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-6 max-w-[760px]">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze">
              {getCategoryLabel(post.category)}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-text-muted">
              <CalendarIcon className="h-4 w-4 text-bronze" />
              <span>{formatPostDate(post.publishedAt)}</span>
              {post.updatedAt ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>обновлено {formatPostDate(post.updatedAt)}</span>
                </>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>{getCategoryLabel(post.category)}</span>
            </div>
          </div>

          <div className="relative mt-8 aspect-[16/9] w-full max-w-[760px] overflow-hidden rounded-2xl bg-ink/5">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 760px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
            <ArticleBody blocks={post.body} />

            <aside className="order-first lg:order-last">
              <TableOfContents headings={headings} />
            </aside>
          </div>

          <div className="max-w-[760px]">
            <ArticleCommercialCta />

            <div className="mt-10">
              <AuthorBlock authorId={post.authorId} />
            </div>
          </div>

          <div className="mt-16">
            <RelatedArticles posts={related} />
          </div>

          <div className="mt-16 max-w-[760px]">
            <ArticleFinalCta />
          </div>
        </Container>
      </main>
      <MobileCallBar />
      <Footer />
    </>
  );
}
