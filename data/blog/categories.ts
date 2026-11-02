import type { BlogCategory } from "@/data/blog/types";

export const blogCategories: BlogCategory[] = [
  { id: "family", label: "Семейное право" },
  { id: "inheritance", label: "Наследственные споры" },
  { id: "civil", label: "Гражданские дела" },
  { id: "criminal", label: "Уголовные дела" },
  { id: "dtp", label: "ДТП" },
  { id: "business", label: "Защита бизнеса" },
  { id: "advice", label: "Юридические советы" },
];

export function getCategoryLabel(id: string): string {
  return blogCategories.find((category) => category.id === id)?.label ?? "Статьи";
}
