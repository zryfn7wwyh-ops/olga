import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geologica/wght.css";
import "./globals.css";
import { company, seo, siteUrl, ui } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    title: seo.title,
    description: seo.description,
    siteName: company.brand,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0F0D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-anim={ui.motion ? "on" : "off"}>
      <body>{children}</body>
    </html>
  );
}
