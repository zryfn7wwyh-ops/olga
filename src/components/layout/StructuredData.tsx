import { company, seo, siteUrl } from "@/content/site";

/**
 * Organization/Service — только для подтверждённых сведений.
 * Пока company.confirmed = false, разметка не выводится.
 */
export function StructuredData() {
  if (!company.confirmed) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Создание сайтов для бизнеса",
    description: seo.description,
    url: siteUrl,
    provider: {
      "@type": "Organization",
      name: company.brand,
      url: siteUrl,
      ...(company.contacts.email ? { email: company.contacts.email } : {}),
      ...(company.contacts.phone ? { telephone: company.contacts.phone } : {}),
    },
    areaServed: "RU",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
