import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-base font-bold text-text-primary">
          {label}
          {required && <span aria-hidden="true" className="text-danger"> *</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-required={required || undefined}
          className={`focus-ring h-[52px] w-full rounded-button border bg-surface px-4 text-base font-medium text-text-primary placeholder:text-text-secondary/70 transition-colors duration-150 ${
            error
              ? "border-danger focus:border-danger"
              : "border-border focus:border-primary"
          } ${className}`}
          {...props}
        />
        {hint && !error && (
          <span id={hintId} className="text-xs text-text-secondary">
            {hint}
          </span>
        )}
        {error && (
          <span id={errorId} role="alert" className="text-sm font-semibold text-danger">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
