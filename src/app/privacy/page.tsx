import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { site } from "@/content/site";
import { consentText, privacyPolicy, type LegalDocument } from "@/content/legal";

export const metadata: Metadata = {
  title: `Политика обработки персональных данных — ${site.name}`,
  robots: site.legal.documentsApproved && site.indexing ? { index: true, follow: true } : { index: false, follow: false },
};

export default function PrivacyPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <main className="on-light min-h-dvh bg-paper">
      <div className="container-lp max-w-[860px]! py-16 md:py-24">
        <a href={`${base}/`} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink link-underline">
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          {site.name}
        </a>
        <DocumentBlock id="privacy" doc={privacyPolicy} level="h1" />
        <DocumentBlock id="consent" doc={consentText} level="h2" />
      </div>
    </main>
  );
}

function DocumentBlock({ id, doc, level }: { id: string; doc: LegalDocument; level: "h1" | "h2" }) {
  const Heading = level;
  const ready = site.legal.documentsApproved && doc.paragraphs.length > 0;
  return (
    <section id={id} className="mt-14 scroll-mt-8 border-t border-stroke pt-10">
      <Heading className="h2">{doc.title}</Heading>
      {doc.updatedAt && <p className="mt-3 text-[14px] text-muted-text">Редакция от {doc.updatedAt}</p>}
      {ready ? (
        <div className="mt-8 space-y-4 text-[16px] leading-relaxed">
          {doc.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <div className="mt-6 max-w-[62ch]">
          {site.mode === "preview" && (
            <p className="mb-3 inline-flex rounded-full border border-dashed border-gold-ink/60 px-3 py-1 text-[12px] font-bold tracking-[0.12em] text-gold-ink uppercase">
              Заглушка · заменить утверждённым текстом
            </p>
          )}
          <p className="text-[16px] text-muted-text">
            Документ проходит юридическое согласование и будет опубликован оператором персональных данных до начала
            приёма заявок.
          </p>
        </div>
      )}
    </section>
  );
}
