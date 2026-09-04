import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import { landingContent } from "@/content/landing";
import { YandexMetrika } from "@/lib/analytics/YandexMetrika";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: landingContent.meta.title,
  description: landingContent.meta.description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: landingContent.meta.title,
    description: landingContent.meta.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: landingContent.meta.title,
    description: landingContent.meta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body className="font-sans antialiased">
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
