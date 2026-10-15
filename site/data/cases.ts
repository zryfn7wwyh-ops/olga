/**
 * Кейсы. Реальные материалы не предоставлены — ниже явно подписанные placeholder-кейсы.
 * Заменить содержимое на реальное и убрать флаг placeholder.
 */
export type CaseItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  situation: string;
  task: string;
  actions: string;
  result: string;
  featured?: boolean;
  placeholder?: boolean;
};

const stub = "Контент кейса будет добавлен.";

export const caseCategories = [
  "Торги",
  "Залоговое имущество",
  "Недвижимость",
  "Конфликт кредиторов",
  "Жалобы",
  "Оспаривание",
  "Оценка",
  "Сложные процедуры",
];

export const cases: CaseItem[] = [
  { id: "case-1", category: "Торги", title: "Контент кейса будет добавлен", summary: "Краткий результат по реальному кейсу — после предоставления материалов.", situation: stub, task: stub, actions: stub, result: stub, featured: true, placeholder: true },
  { id: "case-2", category: "Залоговое имущество", title: "Контент кейса будет добавлен", summary: "Краткий результат по реальному кейсу — после предоставления материалов.", situation: stub, task: stub, actions: stub, result: stub, placeholder: true },
  { id: "case-3", category: "Конфликт кредиторов", title: "Контент кейса будет добавлен", summary: "Краткий результат по реальному кейсу — после предоставления материалов.", situation: stub, task: stub, actions: stub, result: stub, placeholder: true },
  { id: "case-4", category: "Оценка", title: "Контент кейса будет добавлен", summary: "Краткий результат по реальному кейсу — после предоставления материалов.", situation: stub, task: stub, actions: stub, result: stub, placeholder: true },
];
