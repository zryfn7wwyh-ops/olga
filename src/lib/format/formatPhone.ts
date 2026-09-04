/**
 * Форматирует ввод телефона в маску +7 (___) ___-__-__.
 * Принимает уже введенное значение и новый ввод, возвращает
 * отформатированную строку не длиннее полной маски.
 */
export function formatPhoneInput(rawValue: string): string {
  let digits = rawValue.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }
  digits = digits.slice(0, 11);

  const rest = digits.slice(1);
  let formatted = "+7";
  if (rest.length > 0) formatted += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) formatted += `)`;
  if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) formatted += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) formatted += `-${rest.slice(8, 10)}`;

  return formatted;
}
