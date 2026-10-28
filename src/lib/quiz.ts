import type { SiteType } from "@/lib/leads/schema";

export type QuizQuestion = {
  id: "goal" | "current" | "launch";
  title: string;
  options: { value: string; label: string }[];
};

/** Вопросы и ответы — из HTML-прототипа, порядок сохранён. */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "goal",
    title: "Для чего в первую очередь нужен сайт?",
    options: [
      { value: "single_service", label: "Получать заявки по одной услуге" },
      { value: "company", label: "Представить компанию и несколько услуг" },
      { value: "assortment", label: "Показать товары или ассортимент" },
      { value: "unsure", label: "Пока сложно определиться" },
    ],
  },
  {
    id: "current",
    title: "У вас уже есть действующий сайт?",
    options: [
      { value: "none", label: "Нет, создаём с нуля" },
      { value: "replace", label: "Да, нужен новый сайт" },
      { value: "improve", label: "Есть сайт, хотим его улучшить" },
    ],
  },
  {
    id: "launch",
    title: "Когда планируете запуск?",
    options: [
      { value: "soon", label: "В ближайшее время" },
      { value: "1_3_months", label: "В течение 1–3 месяцев" },
      { value: "exploring", label: "Пока изучаем варианты" },
    ],
  },
];

export type QuizAnswers = Partial<Record<QuizQuestion["id"], string>>;

export type QuizRecommendation = {
  siteType: SiteType;
  title: string;
  text: string;
};

const RECOMMENDATIONS: Record<string, QuizRecommendation> = {
  single_service: {
    siteType: "landing",
    title: "Вам подойдёт лендинг",
    text: "Одна страница, выстроенная вокруг одного предложения и формы заявки. Состав блоков и бюджет уточним после короткого обсуждения.",
  },
  company: {
    siteType: "corporate",
    title: "Вам подойдёт корпоративный сайт",
    text: "Несколько разделов о компании, услугах и подходе. Структуру и объём определим вместе, исходя из ваших задач.",
  },
  assortment: {
    siteType: "catalog",
    title: "Вам подойдёт сайт-каталог",
    text: "Структурированный ассортимент с карточками и понятной навигацией. Объём каталога и нужные функции обсудим отдельно.",
  },
  unsure: {
    siteType: "unknown",
    title: "Подберём формат после короткого обсуждения",
    text: "Расскажите о бизнесе и задаче — предложим подходящий тип сайта и состав работ.",
  },
};

export function recommendSite(answers: QuizAnswers): QuizRecommendation {
  return RECOMMENDATIONS[answers.goal ?? "unsure"] ?? RECOMMENDATIONS.unsure;
}

export function isQuizComplete(answers: QuizAnswers): answers is Required<QuizAnswers> {
  return QUIZ_QUESTIONS.every((q) => q.options.some((o) => o.value === answers[q.id]));
}
