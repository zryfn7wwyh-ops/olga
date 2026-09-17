import { useId } from "react";
import { siteConfig } from "@/config/site";

/**
 * Production site mark — "Dense Network": a hub node with six satellites
 * connected by traces of different weight, one secondary link between two
 * satellites. Chosen from the digital-trace concept set explored in
 * /brand-preview (concept K). Each node renders as a glossy radial-gradient
 * sphere, matching the dimensional treatment validated in the 3D exploration.
 */

export type LogoVariant = "mark" | "markWithLabel";
export type LogoTheme = "light" | "dark";

interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: number;
  /** Favicon-scale rendering: 3 nodes instead of 7, thicker traces. */
  simplified?: boolean;
  className?: string;
}

export function Logo({ variant = "mark", theme = "light", size = 32, simplified, className }: LogoProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const isDark = theme === "dark";
  const lineColor = isDark ? "#E8F1FF" : "#246BFD";
  const hubId = `lg-hub-${uid}`;
  const accId = `lg-acc-${uid}`;
  const satId = `lg-sat-${uid}`;

  const mark = (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={variant === "mark" ? className : undefined}>
      <defs>
        <radialGradient id={hubId} cx="33%" cy="26%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor={isDark ? "#BCD6FF" : "#4C86FF"} />
          <stop offset="100%" stopColor={isDark ? "#3A76FB" : "#0B1C3D"} />
        </radialGradient>
        <radialGradient id={accId} cx="33%" cy="26%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#7FE6FF" />
          <stop offset="100%" stopColor={isDark ? "#00C2FF" : "#036C8A"} />
        </radialGradient>
        <radialGradient id={satId} cx="33%" cy="26%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor={isDark ? "#BCD6FF" : "#3A76FB"} />
          <stop offset="100%" stopColor={isDark ? "#3A76FB" : "#0B1C3D"} />
        </radialGradient>
      </defs>
      {simplified ? (
        <>
          <g id="TraceLine" stroke={lineColor} strokeWidth={1.8}>
            <path d="M14 18L6 9" opacity={0.55} />
            <path d="M14 18L25 8" opacity={0.9} />
          </g>
          <g id="Node01">
            <circle cx={6} cy={9} r={2.1} fill={`url(#${satId})`} />
          </g>
          <g id="Node02">
            <circle cx={14} cy={18} r={3.8} fill={`url(#${hubId})`} />
          </g>
          <g id="Node03">
            <circle cx={25} cy={8} r={2.4} fill={`url(#${accId})`} />
          </g>
        </>
      ) : (
        <>
          <g id="TraceLine" stroke={lineColor} strokeLinecap="round">
            <path d="M14 18L6.5 8.5" strokeWidth={1} opacity={0.4} />
            <path d="M14 18L21 6.5" strokeWidth={1.1} opacity={0.55} />
            <path d="M14 18L26.3 14.5" strokeWidth={1.3} opacity={0.8} />
            <path d="M14 18L23.5 24" strokeWidth={1} opacity={0.4} />
            <path d="M14 18L7.5 24.5" strokeWidth={1} opacity={0.5} />
            <path d="M14 18L4.3 16.5" strokeWidth={0.9} opacity={0.3} />
            <path d="M21 6.5L26.3 14.5" strokeWidth={0.7} opacity={0.22} />
          </g>
          <g id="Node01">
            <circle cx={6.5} cy={8.5} r={1.3} fill={`url(#${satId})`} />
          </g>
          <g id="Node02">
            <circle cx={21} cy={6.5} r={1.6} fill={`url(#${satId})`} />
          </g>
          <g id="Node03">
            <circle cx={23.5} cy={24} r={1.2} fill={`url(#${satId})`} />
          </g>
          <g id="Node04">
            <circle cx={7.5} cy={24.5} r={1.4} fill={`url(#${satId})`} />
          </g>
          <g id="Node05">
            <circle cx={4.3} cy={16.5} r={0.9} fill={`url(#${satId})`} />
          </g>
          <g id="Node06">
            <circle cx={14} cy={18} r={4.6} fill={isDark ? "#00C2FF" : "#246BFD"} opacity={0.14} />
            <circle cx={14} cy={18} r={3.1} fill={`url(#${hubId})`} />
          </g>
          <g id="Node07">
            <circle cx={26.3} cy={14.5} r={4} fill="#00C2FF" opacity={0.2} />
            <circle cx={26.3} cy={14.5} r={2.1} fill={`url(#${accId})`} />
          </g>
        </>
      )}
    </svg>
  );

  if (variant === "mark") return mark;

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      {mark}
      <span className={`font-heading text-base font-bold ${isDark ? "text-white" : "text-navy"}`}>
        {siteConfig.siteName}
      </span>
    </span>
  );
}
