export type DocumentItem = {
  id: string;
  title: string;
  organization: string;
  year: string;
  category: string;
  regNumber?: string;
  /** Путь к скану/фото документа. Пусто — используется плейсхолдер, ждём файл. */
  image: string | null;
};

export const documents: DocumentItem[] = [
  {
    id: "lawyer-id",
    title: "Удостоверение адвоката",
    organization: "Адвокатская палата Краснодарского края",
    year: "",
    category: "Удостоверение адвоката",
    regNumber: "23/7006",
    image: null,
  },
  {
    id: "diploma-law",
    title: "Диплом о высшем образовании — квалификация «Юрист», специальность «Юриспруденция»",
    organization: "Кабардино-Балкарский государственный университет",
    year: "1999",
    category: "Диплом",
    regNumber: "№ 709, БВС 0579504",
    image: "/images/documents/diploma-law-1999.jpg",
  },
  {
    id: "diploma-master",
    title: "Диплом магистра по направлению подготовки «Юриспруденция»",
    organization: "Российская академия правосудия",
    year: "2014",
    category: "Диплом",
    regNumber: "№ 447",
    image: "/images/documents/diploma-master-2014.jpg",
  },
  {
    id: "diploma-mediation",
    title: "Диплом о профессиональной переподготовке «Медиация: альтернативные способы урегулирования конфликтов» (750 часов), квалификация «Специалист в области медиации (Медиатор)»",
    organization: "АНО ДПО «НАДПО»",
    year: "2022",
    category: "Диплом о переподготовке",
    regNumber: "№ 24834",
    image: "/images/documents/diploma-mediation.jpg",
  },
  {
    id: "certificate-fpa",
    title: "Сертификат за участие в цикле вебинаров «Психология профессионального и личностного роста адвоката»",
    organization: "Федеральная палата адвокатов Российской Федерации",
    year: "2025",
    category: "Профессиональное свидетельство",
    image: "/images/documents/certificate-fpa-rf-2025.jpg",
  },
  {
    id: "certificate-management",
    title: "Удостоверение о повышении квалификации «Системное управление организацией» (288 часов)",
    organization: "Международный институт менеджмента ЛИНК",
    year: "2020",
    category: "Удостоверение",
    regNumber: "№ 2977-420",
    image: "/images/documents/certificate-link-management.jpg",
  },
  {
    id: "certificate-itc",
    title: "Сертификат «Дебиторская задолженность. Психология воздействия на должников. Переговоры по долгам»",
    organization: "Бизнес-школа ITC Group",
    year: "2020",
    category: "Сертификат",
    regNumber: "№ 1277/О-11722-20/1",
    image: "/images/documents/certificate-itc-group.jpg",
  },
  {
    id: "diploma-aromatherapy",
    title: "Диплом о профессиональной переподготовке «Ароматерапия в практике психолога» (501 час)",
    organization: "АНО ДПО «НАДПО»",
    year: "2021",
    category: "Диплом о переподготовке",
    regNumber: "№ 14010",
    image: "/images/documents/diploma-aromatherapy.jpg",
  },
  {
    id: "vs-rf-ruling",
    title: "Определение Судебной коллегии по гражданским делам Верховного Суда РФ",
    organization: "Верховный Суд Российской Федерации",
    year: "2026",
    category: "Судебный акт",
    image: "/images/documents/document-vs-rf-ruling.jpg",
  },
];
