import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.indexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...(site.url ? { sitemap: `${site.url}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/sitemap.xml` } : {}),
  };
}
