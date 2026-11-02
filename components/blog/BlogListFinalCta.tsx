import { BlogCtaButton } from "@/components/blog/BlogCtaButton";

export function BlogListFinalCta() {
  return (
    <div className="rounded-3xl border border-line bg-cream p-8 text-center sm:p-12">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Не нашли ответ на свой вопрос?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-muted">
        Каждая юридическая ситуация индивидуальна. Обсудите свой вопрос с адвокатом и узнайте,
        какие варианты решения возможны в вашем случае.
      </p>
      <div className="mt-6 flex justify-center">
        <BlogCtaButton label="Записаться на консультацию" placement="blog" />
      </div>
    </div>
  );
}
