/**
 * Контакты. Данные из ТЗ (с текущего сайта) — перед публикацией проверить актуальность.
 */
export const contacts = {
  phone: {
    display: "+7 922 699-04-54",
    href: "tel:+79226990454",
  },
  email: "dv7402@yandex.ru",
  /** Ссылка на Telegram (https://t.me/...). Пусто — кнопка Telegram заменяется на e-mail. */
  telegram: "",
  /** Другие каналы (WhatsApp, MAX и т. п.). */
  messengers: [] as { label: string; url: string }[],
  offices: [
    {
      id: "chelyabinsk",
      city: "Челябинск",
      address: "ул. Труда, 84, офис 615",
      /** [широта, долгота]. null — карта ищет по адресу. */
      coords: null as [number, number] | null,
      hours: "",
    },
    {
      id: "sochi",
      city: "Сочи",
      address: "ул. Донская, 9А",
      coords: null as [number, number] | null,
      hours: "",
    },
  ],
  map: {
    zoom: 16,
  },
};

export type Office = (typeof contacts.offices)[number];

export const routeUrl = (o: Office) =>
  o.coords
    ? `https://yandex.ru/maps/?rtext=~${o.coords[0]},${o.coords[1]}&rtt=auto`
    : `https://yandex.ru/maps/?text=${encodeURIComponent(`${o.city}, ${o.address}`)}`;

export const mapEmbedUrl = (o: Office, zoom: number) =>
  o.coords
    ? `https://yandex.ru/map-widget/v1/?ll=${o.coords[1]},${o.coords[0]}&z=${zoom}&pt=${o.coords[1]},${o.coords[0]},pm2dbl`
    : `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(`${o.city}, ${o.address}`)}&z=${zoom}`;
