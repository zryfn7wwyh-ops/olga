/**
 * Все юридические ссылки, контактные данные и настраиваемые флаги
 * собраны здесь, чтобы их можно было менять без правок компонентов.
 */

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  siteName: "Роском Онлайн",

  legalEntity: {
    name: 'ООО «Роском Онлайн»',
    inn: "0000000000",
    ogrn: "0000000000000",
    phone: "+7 (000) 000-00-00",
    phoneHref: "tel:+70000000000",
    email: "info@roskom.online",
  },

  // Реальные документы размещены вне этого проекта — ссылки задаются
  // через env. Пока переменная не заполнена, ссылка ведет на "#",
  // чтобы не создавать в проекте отдельные страницы политик.
  links: {
    privacyPolicy: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || "#",
    personalDataConsent:
      process.env.NEXT_PUBLIC_PERSONAL_DATA_CONSENT_URL || "#",
    advertisingConsent:
      process.env.NEXT_PUBLIC_ADVERTISING_CONSENT_URL || "#",
  },

  analytics: {
    yandexMetrikaId: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "",
  },

  /**
   * Настройка обязательности чекбоксов согласия в форме.
   * Согласие на обработку ПДн обязательно всегда по закону,
   * согласие на рекламную рассылку можно сделать необязательным.
   */
  consents: {
    personalDataConsentRequired: true,
    marketingConsentRequired: false,
  },

  cookieBanner: {
    enabled: false,
    text: "Мы используем файлы cookie для аналитики и улучшения работы сайта.",
    acceptLabel: "Принять",
  },
} as const;
