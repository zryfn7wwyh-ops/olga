/**
 * Три самостоятельных концепции знака по ТЗ «Логотип цифрового следа»:
 * A — Scan Trace (приоритетная), B — Digital Trace, C — Scan Point.
 * Геометрия каждой сгруппирована как ScanCorners/TraceLine/NodeNN — так,
 * чтобы в будущем элементы можно было анимировать независимо
 * (scanner corners → trace-line → nodes → короткий pulse).
 */

export type LogoConcept = "a" | "b" | "c";
export type LogoTheme = "light" | "dark" | "mono-black" | "mono-white" | "mono-blue";

interface ColorSet {
  geometry: string;
  accent: string;
  glow: string;
}

const THEMES: Record<LogoTheme, ColorSet> = {
  light: { geometry: "#246BFD", accent: "#00C2FF", glow: "#00C2FF" },
  dark: { geometry: "#FFFFFF", accent: "#00C2FF", glow: "#00C2FF" },
  "mono-black": { geometry: "#101828", accent: "#101828", glow: "#101828" },
  "mono-white": { geometry: "#FFFFFF", accent: "#FFFFFF", glow: "#FFFFFF" },
  "mono-blue": { geometry: "#246BFD", accent: "#246BFD", glow: "#246BFD" },
};

function ConceptA({ c, simplified }: { c: ColorSet; simplified?: boolean }) {
  if (simplified) {
    // Favicon-адаптация: только рамка сканера и «сбежавшая» точка.
    return (
      <>
        <g id="ScanCorners" stroke={c.geometry} strokeWidth={2.6} strokeLinecap="round">
          <path d="M5 11V8C5 6.3 6.3 5 8 5H11" />
          <path d="M21 5H24C25.7 5 27 6.3 27 8V11" />
          <path d="M27 21V24C27 25.7 25.7 27 24 27H21" />
          <path d="M11 27H8C6.3 27 5 25.7 5 24V21" />
        </g>
        <g id="Node03">
          <circle cx={27} cy={7} r={4.4} fill={c.glow} opacity={0.22} />
          <circle cx={27} cy={7} r={2.4} fill={c.accent} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="ScanCorners" stroke={c.geometry} strokeWidth={2} strokeLinecap="round">
        <path d="M6 11V8.5C6 7.1 7.1 6 8.5 6H11" />
        <path d="M21 6H23.5C24.9 6 26 7.1 26 8.5V11" />
        <path d="M26 21V23.5C26 24.9 24.9 26 23.5 26H21" />
        <path d="M11 26H8.5C7.1 26 6 24.9 6 23.5V21" />
      </g>
      <g id="TraceLine" stroke={c.geometry} strokeWidth={1.4} strokeLinecap="round">
        <path d="M13.5 18L20 13" />
        <path d="M22.5 11.2L27 8" strokeDasharray="1 2.4" opacity={0.55} />
      </g>
      <g id="Node01">
        <circle cx={13.5} cy={18} r={2.3} fill={c.geometry} />
      </g>
      <g id="Node02">
        <circle cx={20} cy={13} r={1.7} fill={c.geometry} />
      </g>
      <g id="Node03">
        <circle cx={27} cy={8} r={3.4} fill={c.glow} opacity={0.18} />
        <circle cx={27} cy={8} r={1.6} fill={c.accent} />
      </g>
    </>
  );
}

function ConceptB({ c, simplified }: { c: ColorSet; simplified?: boolean }) {
  if (simplified) {
    // Favicon-адаптация: два узла и один уверенный сегмент траектории.
    return (
      <>
        <g id="TraceLine">
          <path d="M9 22L23 8" stroke={c.geometry} strokeWidth={2.2} strokeLinecap="round" />
        </g>
        <g id="Node02">
          <circle cx={9} cy={22} r={2.6} fill={c.geometry} />
        </g>
        <g id="Node04">
          <circle cx={23} cy={8} r={4.4} fill={c.glow} opacity={0.2} />
          <circle cx={23} cy={8} r={2.4} fill={c.accent} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="TraceLine">
        <path d="M7 23L12.5 12" stroke={c.geometry} strokeWidth={1.2} strokeLinecap="round" opacity={0.45} />
        <path d="M12.5 12L18.5 17.5" stroke={c.geometry} strokeWidth={1.6} strokeLinecap="round" />
        <path d="M18.5 17.5L25 8.5" stroke={c.geometry} strokeWidth={1.8} strokeLinecap="round" />
      </g>
      <g id="Node01">
        <circle cx={7} cy={23} r={1.3} fill={c.geometry} opacity={0.5} />
      </g>
      <g id="Node02">
        <circle cx={12.5} cy={12} r={2.6} fill={c.geometry} />
      </g>
      <g id="Node03">
        <circle cx={18.5} cy={17.5} r={1.9} fill={c.geometry} />
      </g>
      <g id="Node04">
        <circle cx={25} cy={8.5} r={3.6} fill={c.glow} opacity={0.16} />
        <circle cx={25} cy={8.5} r={1.7} fill={c.accent} />
      </g>
    </>
  );
}

function ConceptC({ c }: { c: ColorSet; simplified?: boolean }) {
  return (
    <>
      <g id="ScanCorners" stroke={c.geometry} strokeWidth={2.2} strokeLinecap="round">
        <path d="M6 12V8.5C6 7.1 7.1 6 8.5 6H12" />
        <path d="M26 20V23.5C26 24.9 24.9 26 23.5 26H20" />
      </g>
      <g id="TraceLine">
        <path d="M11 21L21 11" stroke={c.geometry} strokeWidth={1.3} strokeLinecap="round" opacity={0.4} />
      </g>
      <g id="Node01">
        <circle cx={16} cy={16} r={4} fill={c.glow} opacity={0.18} />
        <circle cx={16} cy={16} r={2.6} fill={c.accent} />
      </g>
    </>
  );
}

const CONCEPTS: Record<LogoConcept, typeof ConceptA> = { a: ConceptA, b: ConceptB, c: ConceptC };

interface LogoMarkProps {
  concept: LogoConcept;
  theme?: LogoTheme;
  size?: number;
  /** Упрощённая адаптация для фавикона — меньше элементов, толще линии. */
  simplified?: boolean;
  className?: string;
}

export function LogoMark({ concept, theme = "light", size = 32, simplified, className }: LogoMarkProps) {
  const colors = THEMES[theme];
  const Concept = CONCEPTS[concept];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <Concept c={colors} simplified={simplified} />
    </svg>
  );
}

export const LOGO_CONCEPT_LABELS: Record<LogoConcept, string> = {
  a: "Scan Trace",
  b: "Digital Trace",
  c: "Scan Point",
};
