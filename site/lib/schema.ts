import { site } from "@/data/site";
import { contacts } from "@/data/contacts";

/** Schema.org: Person + ProfessionalService. */
export function jsonLd() {
  const personId = `${site.url}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        jobTitle: site.role,
        url: site.url,
        telephone: contacts.phone.href.replace("tel:", ""),
        email: contacts.email,
        knowsAbout: [
          "Банкротство",
          "Финансовое управление в процедурах банкротства",
          "Организация и проведение торгов",
          "Реализация залогового имущества",
          "Оценка имущества",
        ],
        ...(contacts.telegram ? { sameAs: [contacts.telegram] } : {}),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#service`,
        name: `${site.name} — ${site.role}`,
        description: site.description,
        url: site.url,
        telephone: contacts.phone.href.replace("tel:", ""),
        email: contacts.email,
        founder: { "@id": personId },
        areaServed: { "@type": "Country", name: "Россия" },
        address: contacts.offices.map((o) => ({
          "@type": "PostalAddress",
          addressCountry: "RU",
          addressLocality: o.city,
          streetAddress: o.address,
        })),
      },
    ],
  };
}
