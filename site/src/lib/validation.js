const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validators = {
  name: (v) => (v.trim().length < 2 ? 'Укажите имя (не менее 2 символов)' : ''),
  phone: (v) => {
    const digits = v.replace(/\D/g, '');
    if (!digits) return 'Укажите телефон';
    return digits.length < 10 || digits.length > 15 ? 'Проверьте номер телефона' : '';
  },
  email: (v) => {
    if (!v.trim()) return 'Укажите адрес электронной почты';
    return EMAIL_RE.test(v.trim()) ? '' : 'Проверьте адрес электронной почты';
  },
  program: (v) => (v ? '' : 'Выберите программу'),
  message: (v) => (v.trim().length < 5 ? 'Напишите сообщение (не менее 5 символов)' : ''),
  consent: (v) => (v ? '' : 'Необходимо согласие на обработку персональных данных'),
};

export function validate(values, fields) {
  const errors = {};
  for (const f of fields) {
    const msg = validators[f](values[f]);
    if (msg) errors[f] = msg;
  }
  return errors;
}
