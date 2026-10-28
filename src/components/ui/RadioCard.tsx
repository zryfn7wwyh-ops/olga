"use client";

import { forwardRef, type CSSProperties, type ReactNode } from "react";
import s from "./ui.module.css";

export type Option<T extends string> = { value: T; label: ReactNode };

type Props<T extends string> = {
  name: string;
  legend: ReactNode;
  legendHidden?: boolean;
  options: readonly Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: number;
  size?: "md" | "lg";
  error?: string | null;
  idPrefix: string;
};

/** Группа радиокарточек на нативных input[type=radio]: стрелки и Tab работают из коробки. */
function RadioCardGroupInner<T extends string>(
  { name, legend, legendHidden, options, value, onChange, columns = 2, size = "md", error, idPrefix }: Props<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const errorId = `${idPrefix}-error`;
  return (
    <fieldset className={s.fieldset} aria-describedby={error ? errorId : undefined}>
      <legend className={legendHidden ? "visually-hidden" : s.legend}>{legend}</legend>
      <div className={s.radioGrid} style={{ "--cols": columns } as CSSProperties}>
        {options.map((o, i) => (
          <label key={o.value} className={`${s.radioCard} ${size === "lg" ? s.radioCardLarge : ""}`}>
            <input
              ref={i === 0 ? ref : undefined}
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              aria-invalid={error ? true : undefined}
            />
            <span className={s.radioDot} aria-hidden="true" />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className={s.error} id={errorId}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

export const RadioCardGroup = forwardRef(RadioCardGroupInner) as <T extends string>(
  p: Props<T> & { ref?: React.Ref<HTMLInputElement> },
) => ReturnType<typeof RadioCardGroupInner>;

type SegmentedProps<T extends string> = {
  name: string;
  legend: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends string>({ name, legend, options, value, onChange }: SegmentedProps<T>) {
  return (
    <fieldset className={s.fieldset}>
      <legend className={s.legend}>{legend}</legend>
      <div className={s.segmented}>
        {options.map((o) => (
          <label key={o.value} className={s.segment}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
