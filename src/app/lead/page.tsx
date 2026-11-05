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
    <main style={{ padding: "clamp(48px, 6vw, 96px) var(--gx)", maxWidth: 720, margin: "0 auto", display: "grid", gap: 24 }}>
      <h1 style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.032em", lineHeight: 1.05 }}>{t.title}</h1>
      <p style={{ color: "var(--mut)" }}>{t.text}</p>
      <a href="/#calc" style={{ color: "var(--accent)", fontWeight: 400 }}>
        ← Вернуться на страницу
      </a>
    </main>
  );
}
