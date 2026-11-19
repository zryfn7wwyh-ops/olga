import { faq } from "@/content/faq";
import { site } from "@/content/site";

/** FAQPage JSON-LD — выводится только при site.seo.faqJsonLd = true. */
export function FaqJsonLd() {
  if (!site.seo.faqJsonLd) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
