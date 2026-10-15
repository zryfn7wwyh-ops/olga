/**
 * Команда. Данные о специалистах не предоставлены — карточки-placeholder.
 * photo: путь в /public/images/team/..., null — placeholder.
 */
export type TeamMember = {
  id: string;
  name: string;
  position: string;
  specialization: string;
  experience: string;
  competencies: string[];
  personal?: string;
  photo: string | null;
  lead?: boolean;
  placeholder?: boolean;
};

export const team: TeamMember[] = [
  {
    id: "anton",
    name: "Антон Пудовкин",
    position: "Арбитражный управляющий",
    specialization: "Сложные процедуры банкротства, торги, реализация активов",
    experience: "10+ лет в торгах · 8+ лет в банкротстве",
    competencies: ["Финансовое управление", "Организация торгов", "Оценка имущества"],
    photo: null,
    lead: true,
  },
  ...[1, 2, 3].map((n) => ({
    id: `member-${n}`,
    name: "Имя специалиста",
    position: "Должность",
    specialization: "Специализация будет добавлена",
    experience: "Опыт — уточняется",
    competencies: ["Компетенция", "Компетенция", "Компетенция"],
    photo: null,
    placeholder: true,
  })),
];
