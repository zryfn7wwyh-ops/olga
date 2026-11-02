import type { NextConfig } from "next";
import { blogRedirects } from "./data/blog/redirects";

const nextConfig: NextConfig = {
  images: {
    // SVG-обложки демо-статей блога — локальные, не пользовательские файлы.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return blogRedirects.map((redirect) => ({
      source: redirect.from,
      destination: redirect.to,
      permanent: true,
    }));
  },
};

export default nextConfig;
