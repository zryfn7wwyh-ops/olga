import type { NextConfig } from "next";

/**
 * BASE_PATH — путь размещения лендинга.
 *  - "" (по умолчанию) — отдельный домен, страница доступна по "/".
 *  - "/marketing-dlya-yuristov" — при встраивании в существующий сайт.
 * Значение задаётся один раз, чтобы не было дублей контента по двум индексируемым URL.
 */
const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  trailingSlash: Boolean(basePath),
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
