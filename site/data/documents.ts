/**
 * Документы и квалификация. Сканы не предоставлены — placeholder-карточки.
 * image: путь в /public/images/documents/..., null — placeholder.
 */
export type DocumentItem = {
  id: string;
  title: string;
  organization: string;
  year: string;
  image: string | null;
  placeholder?: boolean;
};

const doc = (id: string, title: string): DocumentItem => ({
  id,
  title,
  organization: "Организация — уточняется",
  year: "—",
  image: null,
  placeholder: true,
});

export const documents: DocumentItem[] = [
  doc("registry", "Сведения об арбитражном управляющем"),
  doc("sro", "Членство в СРО"),
  doc("valuer", "Диплом оценщика"),
  doc("education", "Профессиональное образование"),
  doc("training", "Повышение квалификации"),
  doc("certificate", "Сертификат"),
];
