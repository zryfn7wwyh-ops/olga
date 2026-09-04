"use client";

import { useId } from "react";

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  legend: string;
  name: string;
  options: SegmentedControlOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function SegmentedControl({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  required,
}: SegmentedControlProps) {
  const groupId = useId();
  const errorId = `${groupId}-error`;

  return (
    <fieldset className="flex flex-col gap-1.5" aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-medium text-text-primary">
        {legend}
        {required && <span aria-hidden="true" className="text-danger"> *</span>}
      </legend>
      <div
        role="radiogroup"
        aria-label={legend}
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`focus-within:ring-2 focus-within:ring-primary flex h-11 cursor-pointer items-center justify-center rounded-button border text-[14px] font-medium transition-colors duration-150 ${
                isSelected
                  ? "border-primary bg-primary text-white"
                  : error
                    ? "border-danger text-text-secondary hover:border-primary/40"
                    : "border-border text-text-secondary hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error && (
        <span id={errorId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </span>
      )}
    </fieldset>
  );
}
