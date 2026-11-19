import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "primary-dark" | "outline-light" | "outline-dark" | "ghost-light" | "ghost-dark";
export type ButtonSize = "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-3 rounded-[10px] font-sans font-semibold tracking-[0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:cursor-not-allowed aria-disabled:opacity-55 text-center";

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-[15px]",
  lg: "min-h-14 px-7 text-[16px]",
};

/**
 * primary        — золотая кнопка для тёмного фона (контраст ≥ 6:1);
 * primary-dark   — тёмная кнопка для светлого фона;
 * outline-*      — вторичные.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-navy-deep hover:bg-[#c4ab7d] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset] focus-visible:outline-gold-soft",
  "primary-dark": "bg-navy text-ivory hover:bg-navy-deep focus-visible:outline-navy",
  "outline-light":
    "border border-[rgba(245,242,236,0.32)] text-ivory hover:border-gold hover:bg-[rgba(245,242,236,0.04)]",
  "outline-dark": "border border-navy/30 text-ink hover:border-navy hover:bg-navy/[0.03]",
  "ghost-light": "px-0! min-h-11 text-ivory hover:text-gold-soft",
  "ghost-dark": "px-0! min-h-11 text-ink hover:text-gold-ink",
};

export const buttonClass = (variant: ButtonVariant = "primary", size: ButtonSize = "lg", className?: string) =>
  cn(base, sizes[size], variants[variant], className);

type CommonProps = { variant?: ButtonVariant; size?: ButtonSize; children: ReactNode; className?: string };

export const Button = forwardRef<HTMLButtonElement, CommonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  function Button({ variant = "primary", size = "lg", className, children, type = "button", ...rest }, ref) {
    return (
      <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest}>
        {children}
      </button>
    );
  },
);

export function ButtonLink({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("size-5 animate-spin motion-reduce:animate-none", className)} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
