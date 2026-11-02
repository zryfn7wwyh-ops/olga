import type { BlogCategoryId } from "@/data/blog/types";

type BlogPaginationProps = {
  page: number;
  totalPages: number;
  category?: BlogCategoryId;
};

function buildHref(page: number, category?: BlogCategoryId): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function BlogPagination({ page, totalPages, category }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Страницы" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <a
          href={buildHref(page - 1, category)}
          data-track-id={`prev:${page - 1}`}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-text transition-colors hover:border-bronze hover:text-ink"
        >
          Назад
        </a>
      ) : null}

      {pages.map((pageNumber) => {
        const isActive = pageNumber === page;
        return (
          <a
            key={pageNumber}
            href={buildHref(pageNumber, category)}
            data-track-id={String(pageNumber)}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              isActive
                ? "bg-ink text-paper"
                : "border border-line text-text hover:border-bronze hover:text-ink"
            }`}
          >
            {pageNumber}
          </a>
        );
      })}

      {page < totalPages ? (
        <a
          href={buildHref(page + 1, category)}
          data-track-id={`next:${page + 1}`}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-text transition-colors hover:border-bronze hover:text-ink"
        >
          Далее
        </a>
      ) : null}
    </nav>
  );
}
