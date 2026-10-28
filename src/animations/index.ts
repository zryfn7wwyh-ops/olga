/**
 * Точка подключения будущей авторской анимации.
 *
 * В первой версии эффектов НЕТ: функция только находит размеченные слоты и
 * возвращает очистку. Дизайнер добавит обработчики по storyboard, не трогая
 * бизнес-логику форм. Motion-библиотеки подключаются только на этом этапе.
 */

export const MOTION_SLOTS = [
  "hero-title",
  "hero-art",
  "section-intro",
  "case-reveal",
  "process-line",
  "detail-focus",
  "cta-accent",
] as const;

export type MotionSlot = (typeof MOTION_SLOTS)[number];

export type MotionHandler = (el: HTMLElement, layer: HTMLElement | null) => void | (() => void);

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Все элементы слота, сгруппированные по data-motion-id. */
export function collectSlots(root: ParentNode = document): Map<string, { slot: MotionSlot; el: HTMLElement }> {
  const out = new Map<string, { slot: MotionSlot; el: HTMLElement }>();
  root.querySelectorAll<HTMLElement>("[data-motion]").forEach((el) => {
    const slot = el.dataset.motion as MotionSlot;
    const id = el.dataset.motionId;
    if (id && MOTION_SLOTS.includes(slot)) out.set(id, { slot, el });
  });
  return out;
}

/**
 * Инициализация. handlers — по одному на тип слота (заполняет дизайнер).
 * При prefers-reduced-motion обработчики не вызываются — контент и так виден.
 */
export function initMotion(handlers: Partial<Record<MotionSlot, MotionHandler>> = {}, root?: ParentNode): () => void {
  if (prefersReducedMotion()) return () => {};
  const cleanups: (() => void)[] = [];
  for (const { slot, el } of collectSlots(root).values()) {
    const handler = handlers[slot];
    if (!handler) continue;
    const cleanup = handler(el, el.querySelector<HTMLElement>("[data-motion-layer]"));
    if (cleanup) cleanups.push(cleanup);
  }
  return () => cleanups.forEach((fn) => fn());
}
