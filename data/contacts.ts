export const contacts = {
  fullName: "Аксёнова Анита Георгиевна",
  role: "Адвокат",
  regNumber: "23/7006",
  chamber: "Адвокатская палата Краснодарского края",

  phone: "+79892301000",
  phoneDisplay: "+7 (989) 230-10-00",
  email: "advokat_aksenova@mail.ru",

  address: "г. Краснодар, ул. Орджоникидзе, 41",
  addressShort: "Краснодар, ул. Орджоникидзе, 41",
  receptionHours: "Приём по предварительной договорённости",

  // TODO: заменить, когда появятся реальные ссылки
  telegramUrl: "",
  maxUrl: "",

  yandexOrgId: "140904958673",
  yandexMapUrl: "https://yandex.ru/maps/org/140904958673/",
  yandexReviewsUrl:
    "https://yandex.ru/profile/140904958673?lang=ru&utm_source=copy_link&utm_medium=social&utm_campaign=share",
} as const;

export type Contacts = typeof contacts;
