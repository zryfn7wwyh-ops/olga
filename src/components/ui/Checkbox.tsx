import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            className={`focus-ring mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-2 border-border text-primary accent-primary ${
              error ? "border-danger" : ""
            } ${className}`}
            {...props}
          />
          <label htmlFor={checkboxId} className="cursor-pointer text-sm leading-relaxed text-text-secondary">
            {label}
          </label>
        </div>
        {error && (
          <span id={errorId} role="alert" className="pl-8 text-xs font-medium text-danger">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
