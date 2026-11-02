import { PhoneLink } from "@/components/ui/PhoneLink";
import { BlogCtaButton } from "@/components/blog/BlogCtaButton";

export function ArticleFinalCta() {
  return (
    <div className="rounded-3xl border border-line bg-cream p-8 text-center sm:p-12">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Остались вопросы?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-text-muted">
        Позвоните адвокату, чтобы обсудить вашу ситуацию и узнать, какие варианты решения
        возможны в вашем случае.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <BlogCtaButton label="Позвонить адвокату" placement="article" />
        <PhoneLink
          placement="article"
          className="text-lg font-semibold text-ink transition-colors hover:text-bronze"
        />
      </div>
    </div>
  );
}
