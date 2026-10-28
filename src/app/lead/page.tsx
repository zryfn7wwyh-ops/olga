import type { Metadata } from "next";

export const metadata: Metadata = { title: "Статус заявки", robots: { index: false } };

const TEXTS = {
  success: {
    title: "Спасибо! Заявка получена.",
    text: "Мы свяжемся с вами по указанному контакту, чтобы уточнить задачу и подготовить предварительную оценку.",
  },
  invalid: { title: "Проверьте данные заявки", text: "Похоже, контакт указан неполностью или не отмечено согласие. Вернитесь и попробуйте ещё раз." },
  error: { title: "Не удалось отправить заявку", text: "Попробуйте ещё раз немного позже." },
} as const;

/** Страница результата для отправки формы без JavaScript. */
export default async function LeadStatusPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const t = TEXTS[(status as keyof typeof TEXTS) ?? "error"] ?? TEXTS.error;
  return (
    <main style={{ padding: "clamp(3rem, 2rem + 4vw, 6rem) var(--gutter)", maxWidth: 720, margin: "0 auto", display: "grid", gap: 24 }}>
      <h1 style={{ fontSize: "var(--text-2xl)" }}>{t.title}</h1>
      <p style={{ color: "var(--color-muted)" }}>{t.text}</p>
      <a href="/#calc" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
        ← Вернуться на страницу
      </a>
    </main>
  );
}
