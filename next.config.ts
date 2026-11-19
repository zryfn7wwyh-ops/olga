import type { NextConfig } from "next";

/**
 * BASE_PATH — путь размещения лендинга.
 *  - "" (по умолчанию) — отдельный домен, страница доступна по "/".
 *  - "/marketing-dlya-yuristov" — при встраивании в существующий сайт.
 * Значение задаётся один раз, чтобы не было дублей контента по двум индексируемым URL.
 */
const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

/**
 * Защита production-запуска: сборка в режиме production невозможна без рабочей доставки заявок
 * и утверждённых юридических документов. Preview собирается всегда.
 */
if (process.env.NEXT_PUBLIC_SITE_MODE === "production") {
  const problems: string[] = [];
  const delivery = (process.env.LEAD_DELIVERY_MODE ?? "").trim();
  if (!delivery || delivery.includes("demo")) problems.push("LEAD_DELIVERY_MODE не задан или равен demo");
  if (process.env.LEGAL_DOCUMENTS_APPROVED !== "true") problems.push("LEGAL_DOCUMENTS_APPROVED не равен true");
  if (!process.env.NEXT_PUBLIC_SITE_URL) problems.push("NEXT_PUBLIC_SITE_URL не задан");
  if (problems.length > 0) {
    throw new Error(
      `Production-сборка остановлена: ${problems.join("; ")}. См. TODO_BEFORE_LAUNCH.md или соберите preview (NEXT_PUBLIC_SITE_MODE=preview).`,
    );
  }
}

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
