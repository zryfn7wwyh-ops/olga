import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, id, className = "", required, ...props },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span aria-hidden="true" className="text-danger"> *</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            aria-required={required || undefined}
            defaultValue=""
            className={`focus-ring h-[52px] w-full appearance-none rounded-button border bg-surface px-4 pr-10 text-[15px] text-text-primary transition-colors duration-150 ${
              error ? "border-danger focus:border-danger" : "border-border focus:border-primary"
            } ${className}`}
            {...props}
          >
            <option value="" disabled>
              {placeholder || "Выберите вариант"}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
        </div>
        {error && (
          <span id={errorId} role="alert" className="text-xs font-medium text-danger">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
