import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogListFinalCta } from "@/components/blog/BlogListFinalCta";
import { ClickTracker } from "@/components/blog/ClickTracker";
import { getPostsPage, isValidCategory } from "@/lib/blog";
import { getCategoryLabel } from "@/data/blog/categories";
import { buildBreadcrumbJsonLd } from "@/lib/structuredData";
import { getBlogBreadcrumbItems } from "@/components/blog/Breadcrumbs";

type BlogPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = isValidCategory(params.category) ? params.category : undefined;
  const page = Number(params.page) > 1 ? Number(params.page) : 1;

  const titleBase = category
    ? `Статьи: ${getCategoryLabel(category)}`
    : "Статьи и юридические разъяснения";
  const title = page > 1 ? `${titleBase} — страница ${page}` : titleBase;

  return {
    title,
    description:
      "Разбираем сложные правовые вопросы простым языком: семейное право, наследственные споры, гражданские дела, защита бизнеса и юридические советы от адвоката Аксёновой Аниты Георгиевны.",
    alternates: { canonical: "/blog" },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = isValidCategory(params.category) ? params.category : undefined;
  const page = Number(params.page) > 1 ? Number(params.page) : 1;

  const { items, totalPages, page: currentPage } = getPostsPage({ category, page });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(getBlogBreadcrumbItems());

  return (
    <>
      <script
        type="application/ld+json"

        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-paper pb-16 pt-28 lg:pb-24">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
              <span className="h-px w-6 bg-bronze" aria-hidden="true" />
              Статьи
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Статьи и юридические разъяснения
            </h1>
            <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
              Разбираем сложные правовые вопросы простым языком. Практические рекомендации,
              изменения законодательства и ответы на вопросы, с которыми сталкиваются граждане и
              бизнес.
            </p>
          </div>

          <div className="mt-10">
            <ClickTracker goal="blog_filter_change">
              <BlogFilterBar activeCategory={category} />
            </ClickTracker>
          </div>

          {items.length > 0 ? (
            <div className="mt-10">
              <BlogGrid posts={items} />
            </div>
          ) : (
            <p className="mt-10 text-base text-text-muted">
              В этой категории пока нет опубликованных статей.
            </p>
          )}

          {totalPages > 1 ? (
            <div className="mt-12">
              <ClickTracker goal="blog_pagination_click">
                <BlogPagination page={currentPage} totalPages={totalPages} category={category} />
              </ClickTracker>
            </div>
          ) : null}

          <div className="mt-16">
            <BlogListFinalCta />
          </div>
        </Container>
      </main>
      <MobileCallBar />
      <Footer />
    </>
  );
}
