import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import s from "./ui.module.css";

type Props = { id: string; label: ReactNode; error?: string | null } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox({ id, label, error, ...rest }, ref) {
  return (
    <div className={s.checkbox}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>
      {error && (
        <p className={`${s.error} ${s.checkboxError}`} id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});
