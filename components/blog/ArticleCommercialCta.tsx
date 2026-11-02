import { BlogCtaButton } from "@/components/blog/BlogCtaButton";

export function ArticleCommercialCta() {
  return (
    <div className="my-8 rounded-2xl border border-bronze/30 bg-cream p-6 sm:p-7">
      <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
        Нужна помощь адвоката по вашему вопросу?
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
        Каждая ситуация имеет свои детали. Обсудите обстоятельства вашего дела с адвокатом, чтобы
        получить конкретную оценку и понять дальнейшие шаги.
      </p>
      <div className="mt-5">
        <BlogCtaButton label="Записаться на консультацию" placement="article_cta" size="md" />
      </div>
    </div>
  );
}
