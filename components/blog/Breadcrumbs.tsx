import type { BreadcrumbItem } from "@/lib/structuredData";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function getBlogBreadcrumbItems(articleTitle?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Главная", url: "/" },
    { name: "Статьи", url: "/blog" },
  ];
  if (articleTitle) {
    items.push({ name: articleTitle, url: "" });
  }
  return items;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.name}-${index}`} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span className="text-text-muted/60" aria-hidden="true">
                /
              </span>
            ) : null}
            {isLast ? (
              <span className="max-w-[240px] truncate text-text-muted sm:max-w-none">
                {item.name}
              </span>
            ) : (
              <a href={item.url} className="text-text-muted transition-colors hover:text-bronze">
                {item.name}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
