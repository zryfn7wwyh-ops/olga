export type Advantage = {
  id: string;
  kind: "rating" | "years" | "valuer" | "direct" | "assets" | "geo";
  title: string;
  text: string;
};

export const advantages: Advantage[] = [
  {
    id: "rating",
    kind: "rating",
    title: "ТОП-60",
    text: "ТОП-60 арбитражных управляющих по данным регистра ФНС.",
  },
  {
    id: "years",
    kind: "years",
    title: "10+ лет",
    text: "практики проведения и сопровождения торгов.",
  },
  {
    id: "valuer",
    kind: "valuer",
    title: "Управляющий + оценщик",
    text: "Сочетание правовой, финансовой и оценочной экспертизы при работе с активами.",
  },
  {
    id: "direct",
    kind: "direct",
    title: "Работаете напрямую со мной",
    text: "Ключевые вопросы проекта обсуждаются непосредственно с Антоном Пудовкиным. Стратегия и сложные решения не передаются менеджерам.",
  },
  {
    id: "assets",
    kind: "assets",
    title: "Сложные активы",
    text: "Опыт работы с залоговым и нестандартным имуществом.",
  },
  {
    id: "geo",
    kind: "geo",
    title: "Россия",
    text: "Работа с проектами независимо от региона.",
  },
];
