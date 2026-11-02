import { blogCategories } from "@/data/blog/categories";
import type { BlogCategoryId } from "@/data/blog/types";

type BlogFilterBarProps = {
  activeCategory?: BlogCategoryId;
};

export function BlogFilterBar({ activeCategory }: BlogFilterBarProps) {
  const items: Array<{ id: BlogCategoryId | undefined; label: string }> = [
    { id: undefined, label: "Все статьи" },
    ...blogCategories.map((category) => ({ id: category.id, label: category.label })),
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((item) => {
        const isActive = item.id === activeCategory;
        const href = item.id ? `/blog?category=${item.id}` : "/blog";

        return (
          <a
            key={item.label}
            href={href}
            data-track-id={item.id ?? "all"}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-text hover:border-bronze hover:text-ink"
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}
