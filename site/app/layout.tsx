import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { site } from "@/data/site";
import { jsonLd } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#101A22",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ym = site.analytics.yandexMetrikaId;
  return (
    <html lang="ru">
      <body>
        <a href="#main" className="sr-only z-[100] bg-ivory px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Перейти к содержанию
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
        {ym && (
          <Script id="ym" strategy="lazyOnload">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${ym},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
          </Script>
        )}
      </body>
    </html>
  );
}
