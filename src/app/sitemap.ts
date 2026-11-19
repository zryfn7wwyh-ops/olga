import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url || !site.indexing) return [];
  const base = `${site.url}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
  return [{ url: `${base}/`, changeFrequency: "monthly", priority: 1 }];
}
