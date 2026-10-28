import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import s from "./ui.module.css";

type FieldShellProps = {
  id: string;
  label: ReactNode;
  optional?: boolean;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
};

/** Общая оболочка поля: label, подсказка, ошибка рядом с полем. */
export function FieldShell({ id, label, optional, hint, error, children }: FieldShellProps) {
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={id}>
        {label}
        {optional && <span className={s.optional}> — необязательно</span>}
      </label>
      {children}
      {hint && !error && (
        <p className={s.hint} id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className={s.error} id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string | null, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

type InputProps = Omit<FieldShellProps, "children"> & InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { id, label, optional, hint, error, ...rest },
  ref,
) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <input
        ref={ref}
        id={id}
        className={s.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </FieldShell>
  );
});

type TextAreaProps = Omit<FieldShellProps, "children"> & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextAreaField(
  { id, label, optional, hint, error, ...rest },
  ref,
) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <textarea
        ref={ref}
        id={id}
        className={`${s.input} ${s.textarea}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </FieldShell>
  );
});

type SelectProps = Omit<FieldShellProps, "children"> &
  SelectHTMLAttributes<HTMLSelectElement> & { options: readonly { value: string; label: string }[] };

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(function SelectField(
  { id, label, optional, hint, error, options, ...rest },
  ref,
) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <select
        ref={ref}
        id={id}
        className={`${s.input} ${s.select}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
});
