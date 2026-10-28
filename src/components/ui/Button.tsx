import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import s from "./ui.module.css";

type Variant = "primary" | "secondary" | "ghost" | "onInk" | "onInkSecondary";

type Common = { variant?: Variant; block?: boolean; size?: "md" | "sm"; children: ReactNode };

function cls(variant: Variant, block?: boolean, size?: "md" | "sm", extra?: string) {
  return [s.button, variant !== "primary" && s[variant], block && s.block, size === "sm" && s.small, extra].filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  block,
  size,
  loading,
  className,
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button type="button" {...rest} className={cls(variant, block, size, className)} aria-busy={loading || undefined}>
      {loading && <span className={s.spinner} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  block,
  size,
  className,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a {...rest} className={cls(variant, block, size, className)}>
      {children}
    </a>
  );
}
