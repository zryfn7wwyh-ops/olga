import { contacts } from "@/data/contacts";
import type { BlogAuthor, BlogAuthorId } from "@/data/blog/types";

export const blogAuthors: Record<BlogAuthorId, BlogAuthor> = {
  "anita-aksyonova": {
    id: "anita-aksyonova",
    name: contacts.fullName,
    role: contacts.role,
    statusLine: `${contacts.role} · Рег. № ${contacts.regNumber} · ${contacts.chamber}`,
    photo: "/images/lawyer/anita-aksyonova-profile.jpg",
    bio:
      "Адвокатский стаж — 26 лет, с июля 2000 года. Анита Георгиевна ведёт гражданские и " +
      "уголовные дела, защищает интересы доверителей на стадии следствия и в суде, помогает в " +
      "семейных, имущественных, наследственных спорах и корпоративных конфликтах. Дело ведётся " +
      "лично адвокатом — от изучения документов и разработки стратегии до переговоров, судебных " +
      "заседаний и обжалования принятых решений.",
    profileHref: "/#about",
  },
};
