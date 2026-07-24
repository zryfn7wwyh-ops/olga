import type { Metadata } from "next";
import { Playfair_Display, Golos_Text } from "next/font/google";
import { contacts } from "@/data/contacts";
import { CallModalProvider } from "@/components/CallModalProvider";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const sansFont = Golos_Text({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://aksyonova-advokat.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Адвокат Аксёнова Анита Георгиевна — Краснодар",
    template: "%s — Адвокат Аксёнова Анита Георгиевна",
  },
  description:
    "Адвокат Аксёнова Анита Георгиевна. Защита по гражданским и уголовным делам, семейным, имущественным, наследственным и бизнес-спорам. Адвокатский стаж с 2000 года.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Адвокат Аксёнова Анита Георгиевна",
    title: "Адвокат Аксёнова Анита Георгиевна — Краснодар",
    description:
      "Адвокатская защита в сложных гражданских, уголовных делах и бизнес-спорах. Личное ведение дела, конфиденциальность, стаж с 2000 года.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Адвокат Аксёнова Анита Георгиевна",
    image: `${siteUrl}/opengraph-image`,
    description:
      "Адвокатская защита в сложных гражданских, уголовных делах и бизнес-спорах. Ведение гражданских и уголовных дел, защита семейных, имущественных и наследственных прав, интересов бизнеса и собственников.",
    telephone: contacts.phone,
    email: contacts.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contacts.address,
      addressLocality: "Краснодар",
      addressCountry: "RU",
    },
    areaServed: "RU",
    priceRange: "от 13 000 ₽",
    founder: {
      "@type": "Person",
      name: contacts.fullName,
      jobTitle: "Адвокат",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      description: "Приём по предварительной договорённости",
    },
    url: siteUrl,
  };

  return (
    <html
      lang="ru"
      className={`${displayFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-text">
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CallModalProvider>{children}</CallModalProvider>
      </body>
    </html>
  );
}
