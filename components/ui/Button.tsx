"use client";

import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "primaryOnDark" | "outline" | "outlineLight" | "ghost" | "ghostLight";
  size?: "md" | "lg";
  className?: string;
  icon?: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-y-0 active:scale-[0.98]";

const sizes: Record<NonNullable<CommonProps["size"]>, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variants: Record<NonNullable<CommonProps["variant"]>, string> = {
  primary:
    "bg-ink text-paper hover:-translate-y-0.5 hover:bg-emerald border border-ink hover:border-bronze",
  primaryOnDark:
    "bg-paper text-ink hover:-translate-y-0.5 hover:bg-bronze-soft border border-paper hover:border-bronze-soft",
  outline:
    "bg-transparent text-ink border border-ink/25 hover:-translate-y-0.5 hover:border-bronze hover:text-ink",
  outlineLight:
    "bg-transparent text-paper border border-paper/40 hover:-translate-y-0.5 hover:border-bronze-soft hover:text-paper",
  ghost: "bg-transparent text-ink underline-offset-4 hover:text-bronze",
  ghostLight: "bg-transparent text-paper underline-offset-4 hover:text-bronze-soft",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  ...rest
}: ButtonProps) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
        {icon ? (
          <span className="inline-flex transition-transform duration-200 group-hover:translate-x-0.5">
            {icon}
          </span>
        ) : null}
      </a>
    );
  }

  const { ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
      {icon ? (
        <span className="inline-flex transition-transform duration-200 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
