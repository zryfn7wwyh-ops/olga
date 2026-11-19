import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./globals.css";
import { site } from "@/content/site";
import { LeadModalProvider } from "@/components/forms/LeadModal";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { Analytics } from "@/components/layout/Analytics";

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: site.seo.title,
  description: site.seo.description,
  applicationName: site.name,
  ...(site.url ? { alternates: { canonical: "./" } } : {}),
  robots: site.indexing ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: site.seo.title,
    description: site.seo.description,
    siteName: site.name,
    ...(site.url ? { url: site.url } : {}),
    ...(site.seo.ogImage ? { images: [{ url: site.seo.ogImage, width: 1200, height: 630 }] } : {}),
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0F1B24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Отмечаем, что JS доступен: только тогда скрываем секции до анимации появления. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <LeadModalProvider>{children}</LeadModalProvider>
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
