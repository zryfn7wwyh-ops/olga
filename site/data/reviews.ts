/**
 * Отзывы. Реальные отзывы не предоставлены — явно подписанные placeholder-слоты.
 * Не заполнять вымышленными отзывами.
 */
export type Review = {
  id: string;
  text: string;
  author: string;
  position: string;
  taskType: string;
  videoUrl?: string;
  placeholder?: boolean;
};

export const reviews: Review[] = [1, 2, 3].map((n) => ({
  id: `review-${n}`,
  text: "Здесь будет размещён текст реального отзыва клиента о сотрудничестве — после предоставления и согласования с автором.",
  author: "Имя автора",
  position: "Должность, компания",
  taskType: "Тип задачи",
  placeholder: true,
}));
