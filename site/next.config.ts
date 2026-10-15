import type { NextConfig } from "next";

// Статический экспорт: страницу можно разместить на любом хостинге (out/).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
