import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Arrow } from "./Icon";
import s from "./ui.module.css";

/**
 * primary — изумрудная; outline — контурная; text — текстовая ссылка;
 * light — белая (на акценте); dark — графитовая; soft — полупрозрачная (на тёмном).
 */
export type ButtonVariant = "primary" | "outline" | "text" | "light" | "dark" | "soft";

type Common = {
  variant?: ButtonVariant;
  block?: boolean;
  size?: "md" | "lg" | "sm";
  /** Стрелка справа; на всю ширину — текст слева, стрелка справа. */
  arrow?: boolean;
  children: ReactNode;
};

const VARIANT: Record<ButtonVariant, string | undefined> = {
  primary: undefined,
  outline: s.outline,
  text: s.text,
  light: s.light,
  dark: s.darkBtn,
  soft: s.soft,
};

function cls({ variant = "primary", block, size, arrow }: Omit<Common, "children">, extra?: string) {
  return [
    s.button,
    VARIANT[variant],
    block && s.block,
    size === "lg" && s.lg,
    size === "sm" && s.small,
    arrow && block && s.spread,
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant,
  block,
  size,
  arrow,
  loading,
  className,
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button type="button" {...rest} className={cls({ variant, block, size, arrow }, className)} aria-busy={loading || undefined}>
      {loading && <span className={s.spinner} aria-hidden="true" />}
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  variant,
  block,
  size,
  arrow,
  className,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a {...rest} className={cls({ variant, block, size, arrow }, className)}>
      {children}
      {arrow && <Arrow />}
    </a>
  );
}
