import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { validate } from '../lib/validation.js';

/*
 * Демонстрационная форма: валидация на клиенте, без отправки на сервер.
 * fields: [{ name, label, type: 'text'|'tel'|'email'|'select'|'textarea', options?, autoComplete? }]
 */
export default function DemoForm({ fields, initial = {}, submitLabel = 'Отправить заявку', successText, compact = false }) {
  const uid = useId();
  const blank = Object.fromEntries(fields.map((f) => [f.name, ''])) ;
  const [values, setValues] = useState({ ...blank, consent: false, ...initial });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const names = [...fields.map((f) => f.name), 'consent'];

  const set = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched) setErrors(validate(next, names));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(values, names);
    setErrors(errs);
    if (Object.keys(errs).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="animate-fade-up rounded-xl2 border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10 text-emerald-600" />
        <p className="mt-3 text-lg font-semibold text-navy">Заявка сформирована</p>
        <p className="mt-2 text-sm text-ink">
          {successText || 'Это демонстрационный режим: данные никуда не отправлены. После подключения сервера здесь появится подтверждение отправки.'}
        </p>
        <button
          type="button"
          className="btn-secondary mt-5"
          onClick={() => { setValues({ ...blank, consent: false, ...initial }); setErrors({}); setTouched(false); setSent(false); }}
        >
          Заполнить ещё раз
        </button>
      </div>
    );
  }

  const fieldId = (n) => `${uid}-${n}`;
  const errId = (n) => `${uid}-${n}-err`;
  const common = (f) => ({
    id: fieldId(f.name),
    name: f.name,
    value: values[f.name],
    onChange: (e) => set(f.name, e.target.value),
    'aria-invalid': Boolean(errors[f.name]),
    'aria-describedby': errors[f.name] ? errId(f.name) : undefined,
    className: `input ${errors[f.name] ? 'input-error' : ''}`,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        {fields.map((f) => (
          <div key={f.name} className={f.type === 'textarea' || f.wide ? 'sm:col-span-2' : ''}>
            <label htmlFor={fieldId(f.name)} className="mb-1.5 block text-sm font-medium text-navy">
              {f.label} <span aria-hidden="true" className="text-red-600">*</span>
            </label>
            {f.type === 'select' ? (
              <select {...common(f)}>
                <option value="">Выберите программу</option>
                {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea rows={4} {...common(f)} />
            ) : (
              <input type={f.type} autoComplete={f.autoComplete} placeholder={f.placeholder} {...common(f)} />
            )}
            {errors[f.name] && <p id={errId(f.name)} className="mt-1.5 text-sm text-red-600">{errors[f.name]}</p>}
          </div>
        ))}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? errId('consent') : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-line accent-accent"
          />
          <span>
            Я даю <Link to="/consent" className="link">согласие на обработку персональных данных</Link> и ознакомлен(а) с{' '}
            <Link to="/privacy" className="link">политикой обработки персональных данных</Link>.
          </span>
        </label>
        {errors.consent && <p id={errId('consent')} className="mt-1.5 text-sm text-red-600">{errors.consent}</p>}
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">{submitLabel}</button>
      <p className="text-xs text-muted">Демонстрационный режим: данные формы не передаются на сервер.</p>
    </form>
  );
}
