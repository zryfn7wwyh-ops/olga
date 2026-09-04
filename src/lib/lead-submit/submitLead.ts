import type { LeadFormData } from "@/types/lead";

/**
 * Единственная точка входа для отправки лида во внешнюю систему.
 * Форма и UI не должны знать, куда и как уходят данные — вся
 * интеграция с Bitrix подключается программистом внутри этой функции,
 * без изменения формы.
 */
export async function submitLead(
  data: LeadFormData
): Promise<{ success: boolean }> {
  // TODO: Bitrix integration will be implemented separately
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("submitLead: payload ready for Bitrix integration", data);
  }
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true };
}
