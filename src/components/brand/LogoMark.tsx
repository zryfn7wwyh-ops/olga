import { useId } from "react";

/**
 * Одиннадцать самостоятельных концепций знака «цифровой след»:
 * Раунд 1 (по исходному ТЗ, лаконичные): A — Scan Trace, B — Digital Trace, C — Scan Point.
 * Раунд 2 (фидбэк «слишком примитивно», плотнее и заметнее цифровизация):
 * D — Pixel Dissolve, E — Circuit Trace, F — Data Density, G — Data Stack, H — Grid Resolve.
 * Раунд 3 (фидбэк «нужен сложный, высокотехнологичный продукт» — многослойная,
 * инженерная сложность, а не просто больше точек): I — Orbit System, J — Faceted Core,
 * K — Dense Network.
 * Геометрия сгруппирована по смысловым узлам (ScanCorners/TraceLine/CoreShape/Layers/
 * GridField/Rings/NodeNN), чтобы элементы можно было анимировать независимо.
 */

export type LogoConcept = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k";
export type LogoTheme = "light" | "dark" | "mono-black" | "mono-white" | "mono-blue";

interface ColorSet {
  geometry: string;
  accent: string;
  glow: string;
  gradient?: boolean;
}

const THEMES: Record<LogoTheme, ColorSet> = {
  light: { geometry: "#246BFD", accent: "#00C2FF", glow: "#00C2FF", gradient: true },
  dark: { geometry: "#FFFFFF", accent: "#00C2FF", glow: "#00C2FF" },
  "mono-black": { geometry: "#101828", accent: "#101828", glow: "#101828" },
  "mono-white": { geometry: "#FFFFFF", accent: "#FFFFFF", glow: "#FFFFFF" },
  "mono-blue": { geometry: "#246BFD", accent: "#246BFD", glow: "#246BFD" },
};

interface ConceptProps {
  c: ColorSet;
  simplified?: boolean;
  /** Заливка «основной» сплошной формы — градиент на light-теме, иначе сплошной цвет. */
  coreFill: string;
}

function ConceptA({ c, simplified }: ConceptProps) {
  if (simplified) {
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

function ConceptB({ c, simplified }: ConceptProps) {
  if (simplified) {
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

function ConceptC({ c }: ConceptProps) {
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

function ConceptD({ c, simplified, coreFill }: ConceptProps) {
  // Pixel Dissolve — сплошная форма «распадается» на пиксели: сама метафора оцифровки.
  if (simplified) {
    return (
      <>
        <g id="CoreShape">
          <rect x={5.5} y={5.5} width={13} height={13} rx={3} fill={coreFill} />
        </g>
        <g id="PixelTrail">
          <rect x={21.5} y={9.5} width={4.6} height={4.6} rx={1.1} fill={c.accent} />
          <rect x={26} y={17.5} width={3.2} height={3.2} rx={0.8} fill={c.accent} opacity={0.6} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="CoreShape">
        <rect x={6} y={6} width={14} height={14} rx={3.5} fill={coreFill} />
      </g>
      <g id="PixelTrail">
        <rect x={21.3} y={9.3} width={3.8} height={3.8} rx={1} fill={c.accent} opacity={0.9} />
        <rect x={24.6} y={14.4} width={2.6} height={2.6} rx={0.8} fill={c.accent} opacity={0.62} />
        <rect x={20.2} y={19} width={2.1} height={2.1} rx={0.6} fill={c.geometry} opacity={0.35} />
        <rect x={26.6} y={19.6} width={1.6} height={1.6} rx={0.5} fill={c.accent} opacity={0.4} />
        <rect x={17.4} y={21.6} width={1.5} height={1.5} rx={0.4} fill={c.geometry} opacity={0.22} />
      </g>
    </>
  );
}

function ConceptE({ c, simplified }: ConceptProps) {
  // Circuit Trace — трасса печатной платы: прямые углы, площадки на изгибах.
  if (simplified) {
    return (
      <>
        <g id="TraceLine" stroke={c.geometry} strokeWidth={2.6} strokeLinecap="square">
          <path d="M7 25V12H25" fill="none" />
        </g>
        <g id="Node01">
          <rect x={4.8} y={22.8} width={4.4} height={4.4} rx={1} fill={c.geometry} />
        </g>
        <g id="Node02">
          <circle cx={25} cy={12} r={4.6} fill={c.glow} opacity={0.22} />
          <circle cx={25} cy={12} r={2.6} fill={c.accent} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="TraceLine" stroke={c.geometry} strokeWidth={1.6} strokeLinecap="square">
        <path d="M7 24V13H24" fill="none" />
      </g>
      <g id="Node01">
        <rect x={5.3} y={22.3} width={3.4} height={3.4} rx={0.8} fill={c.geometry} />
      </g>
      <g id="Node02">
        <rect x={5.3} y={11.3} width={3.4} height={3.4} rx={0.8} fill={c.geometry} opacity={0.65} />
      </g>
      <g id="Node03">
        <circle cx={24} cy={13} r={3.8} fill={c.glow} opacity={0.18} />
        <circle cx={24} cy={13} r={2.1} fill={c.accent} />
      </g>
    </>
  );
}

const DATA_DOTS = [
  { x: 7, y: 8, r: 0.7 },
  { x: 10.2, y: 6.8, r: 0.55 },
  { x: 9, y: 11.2, r: 0.8 },
  { x: 13, y: 9.6, r: 0.85 },
  { x: 12, y: 13.6, r: 0.95 },
  { x: 16.2, y: 12.6, r: 1.05 },
  { x: 15, y: 16.8, r: 1.2 },
  { x: 19.2, y: 16, r: 1.35 },
  { x: 18, y: 19.8, r: 1.5 },
];

function ConceptF({ c, simplified }: ConceptProps) {
  // Data Density — рассеянные точки данных уплотняются в яркое ядро сигнала.
  if (simplified) {
    return (
      <>
        <g id="DataField">
          <circle cx={9} cy={9} r={1} fill={c.geometry} opacity={0.3} />
          <circle cx={13.5} cy={13} r={1.4} fill={c.geometry} opacity={0.55} />
        </g>
        <g id="Node01">
          <circle cx={22.5} cy={22.5} r={5.6} fill={c.glow} opacity={0.24} />
          <circle cx={22.5} cy={22.5} r={3.3} fill={c.accent} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="DataField">
        {DATA_DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={c.geometry} opacity={0.22 + i * 0.055} />
        ))}
      </g>
      <g id="Node01">
        <circle cx={23} cy={23} r={4.8} fill={c.glow} opacity={0.2} />
        <circle cx={23} cy={23} r={2.8} fill={c.accent} />
      </g>
    </>
  );
}

function ConceptG({ c, simplified, coreFill }: ConceptProps) {
  // Data Stack — слои данных: непрозрачность убывает сверху вниз, импульс на верхнем слое.
  if (simplified) {
    return (
      <>
        <g id="Layers">
          <rect x={6} y={11} width={18} height={6.5} rx={2} fill={coreFill} />
          <rect x={6} y={19.5} width={18} height={6.5} rx={2} fill={c.geometry} opacity={0.32} />
        </g>
        <g id="Node01">
          <circle cx={24} cy={11} r={3.8} fill={c.glow} opacity={0.26} />
          <circle cx={24} cy={11} r={2.2} fill={c.accent} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="Layers">
        <rect x={7} y={8} width={18} height={5} rx={2} fill={coreFill} />
        <rect x={7} y={14.5} width={18} height={5} rx={2} fill={c.geometry} opacity={0.55} />
        <rect x={7} y={21} width={18} height={5} rx={2} fill={c.geometry} opacity={0.26} />
      </g>
      <g id="Node01">
        <circle cx={25} cy={8} r={3.4} fill={c.glow} opacity={0.2} />
        <circle cx={25} cy={8} r={1.9} fill={c.accent} />
      </g>
    </>
  );
}

function ConceptH({ c, simplified, coreFill }: ConceptProps) {
  // Grid Resolve — сканер «нашёл» несколько ячеек сигнала среди ровной сетки.
  if (simplified) {
    return (
      <g id="Nodes">
        <rect x={7} y={7} width={6} height={6} rx={1.4} fill={c.geometry} opacity={0.5} />
        <rect x={19} y={19} width={6.5} height={6.5} rx={1.5} fill={coreFill} />
      </g>
    );
  }
  return (
    <>
      <g id="GridField">
        <circle cx={8.5} cy={8.5} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={14} cy={8.5} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={25} cy={8.5} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={8.5} cy={14} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={19.5} cy={14} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={25} cy={14} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={8.5} cy={19.5} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={14} cy={19.5} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={19.5} cy={19.5} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={14} cy={25} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={19.5} cy={25} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={25} cy={25} r={0.9} fill={c.geometry} opacity={0.18} />
        <circle cx={25} cy={19.5} r={0.9} fill={c.geometry} opacity={0.18} />
      </g>
      <g id="Nodes">
        <rect x={12} y={12} width={4} height={4} rx={1} fill={c.geometry} opacity={0.75} />
        <rect x={23} y={17.5} width={4} height={4} rx={1} fill={coreFill} />
        <rect x={6} y={23} width={4} height={4} rx={1} fill={c.geometry} opacity={0.5} />
      </g>
    </>
  );
}

function ConceptI({ c, simplified, coreFill }: ConceptProps) {
  // Orbit System — ядро окружено тремя кольцами сканирования на разных фазах
  // вращения, на кольцах — узлы. Читается как сложная многоуровневая система.
  if (simplified) {
    return (
      <>
        <g id="Rings">
          <circle
            cx={16}
            cy={16}
            r={11.5}
            fill="none"
            stroke={c.geometry}
            strokeWidth={1.8}
            opacity={0.5}
            strokeDasharray="20 52"
            strokeLinecap="round"
            transform="rotate(-30 16 16)"
          />
        </g>
        <g id="Node01">
          <circle cx={16} cy={16} r={3.4} fill={coreFill} />
        </g>
        <g id="Node02">
          <circle cx={27} cy={9} r={2.4} fill={c.accent} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="Rings" fill="none" strokeLinecap="round">
        <circle
          cx={16}
          cy={16}
          r={13}
          stroke={c.geometry}
          strokeWidth={1}
          opacity={0.4}
          strokeDasharray="24 58"
          transform="rotate(-35 16 16)"
        />
        <circle
          cx={16}
          cy={16}
          r={9.6}
          stroke={c.geometry}
          strokeWidth={1.1}
          opacity={0.48}
          strokeDasharray="25 35"
          transform="rotate(95 16 16)"
        />
        <circle
          cx={16}
          cy={16}
          r={6.3}
          stroke={c.geometry}
          strokeWidth={1.2}
          opacity={0.55}
          strokeDasharray="20 20"
          transform="rotate(205 16 16)"
        />
      </g>
      <g id="Node01">
        <circle cx={16} cy={16} r={4.2} fill={c.glow} opacity={0.16} />
        <circle cx={16} cy={16} r={2.7} fill={coreFill} />
      </g>
      <g id="Node02">
        <circle cx={27.3} cy={9.4} r={3.2} fill={c.glow} opacity={0.2} />
        <circle cx={27.3} cy={9.4} r={1.7} fill={c.accent} />
      </g>
      <g id="Node03">
        <circle cx={5.6} cy={22.6} r={1.4} fill={c.geometry} opacity={0.85} />
      </g>
      <g id="Node04">
        <circle cx={21.6} cy={26} r={1.1} fill={c.geometry} opacity={0.6} />
      </g>
    </>
  );
}

function ConceptJ({ c, simplified, coreFill }: ConceptProps) {
  // Faceted Core — гранёное шестиугольное ядро (6 граней разной яркости) с
  // траекториями данных, расходящимися от вершин. Инженерная, «огранённая» сложность.
  const facets = [
    { p: "16,16 16,7 23.79,11.5", o: 0.95 },
    { p: "16,16 23.79,11.5 23.79,20.5", o: 0.55 },
    { p: "16,16 23.79,20.5 16,25", o: 0.8 },
    { p: "16,16 16,25 8.21,20.5", o: 0.4 },
    { p: "16,16 8.21,20.5 8.21,11.5", o: 0.65 },
    { p: "16,16 8.21,11.5 16,7", o: 0.28 },
  ];
  if (simplified) {
    return (
      <>
        <g id="CoreShape">
          <polygon points="16,6 24.5,11 24.5,21 16,26 7.5,21 7.5,11" fill={coreFill} />
        </g>
        <g id="Node01">
          <circle cx={27} cy={9} r={2.3} fill={c.accent} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="CoreShape">
        {facets.map((f, i) => (
          <polygon key={i} points={f.p} fill={c.geometry} opacity={f.o} />
        ))}
        <polygon
          points="16,7 23.79,11.5 23.79,20.5 16,25 8.21,20.5 8.21,11.5"
          fill="none"
          stroke={coreFill}
          strokeWidth={0.6}
          opacity={0.9}
        />
      </g>
      <g id="TraceLine" stroke={c.geometry} strokeWidth={1.1} strokeLinecap="round">
        <path d="M16 7V3.2" />
        <path d="M23.79 20.5L27.3 22.6" opacity={0.7} />
        <path d="M8.21 20.5L4.7 22.6" opacity={0.5} />
      </g>
      <g id="Node01">
        <circle cx={16} cy={2.4} r={1.5} fill={c.geometry} />
      </g>
      <g id="Node02">
        <circle cx={28.6} cy={23.4} r={3.1} fill={c.glow} opacity={0.2} />
        <circle cx={28.6} cy={23.4} r={1.7} fill={c.accent} />
      </g>
      <g id="Node03">
        <circle cx={3.4} cy={23.4} r={1.2} fill={c.geometry} opacity={0.7} />
      </g>
    </>
  );
}

function ConceptK({ c, simplified, coreFill }: ConceptProps) {
  // Dense Network — узел-хаб и шесть спутников с трассами разного веса плюс
  // одна вторичная связь между спутниками: карта цифрового следа, а не одна линия.
  if (simplified) {
    return (
      <>
        <g id="TraceLine" stroke={c.geometry} strokeWidth={1.6}>
          <path d="M14 18L6 9" opacity={0.6} />
          <path d="M14 18L25 8" opacity={0.9} />
        </g>
        <g id="Node01">
          <circle cx={6} cy={9} r={1.8} fill={c.geometry} opacity={0.7} />
        </g>
        <g id="Node02">
          <circle cx={14} cy={18} r={3.4} fill={coreFill} />
        </g>
        <g id="Node03">
          <circle cx={25} cy={8} r={3.6} fill={c.glow} opacity={0.22} />
          <circle cx={25} cy={8} r={2} fill={c.accent} />
        </g>
      </>
    );
  }
  return (
    <>
      <g id="TraceLine" strokeLinecap="round">
        <path d="M14 18L6.5 8.5" stroke={c.geometry} strokeWidth={1} opacity={0.4} />
        <path d="M14 18L21 6.5" stroke={c.geometry} strokeWidth={1.1} opacity={0.55} />
        <path d="M14 18L26.3 14.5" stroke={c.geometry} strokeWidth={1.3} opacity={0.75} />
        <path d="M14 18L23.5 24" stroke={c.geometry} strokeWidth={1} opacity={0.4} />
        <path d="M14 18L7.5 24.5" stroke={c.geometry} strokeWidth={1} opacity={0.5} />
        <path d="M14 18L4.3 16.5" stroke={c.geometry} strokeWidth={0.9} opacity={0.32} strokeDasharray="0.5 2" />
        <path d="M21 6.5L26.3 14.5" stroke={c.geometry} strokeWidth={0.7} opacity={0.22} />
      </g>
      <g id="Node01">
        <circle cx={6.5} cy={8.5} r={1.3} fill={c.geometry} opacity={0.7} />
      </g>
      <g id="Node02">
        <circle cx={21} cy={6.5} r={1.6} fill={c.geometry} opacity={0.85} />
      </g>
      <g id="Node03">
        <circle cx={23.5} cy={24} r={1.2} fill={c.geometry} opacity={0.6} />
      </g>
      <g id="Node04">
        <circle cx={7.5} cy={24.5} r={1.4} fill={c.geometry} opacity={0.75} />
      </g>
      <g id="Node05">
        <circle cx={4.3} cy={16.5} r={0.9} fill={c.geometry} opacity={0.4} />
      </g>
      <g id="Node06">
        <circle cx={14} cy={18} r={4.6} fill={c.glow} opacity={0.14} />
        <circle cx={14} cy={18} r={3.1} fill={coreFill} />
      </g>
      <g id="Node07">
        <circle cx={26.3} cy={14.5} r={4} fill={c.glow} opacity={0.22} />
        <circle cx={26.3} cy={14.5} r={2.1} fill={c.accent} />
      </g>
    </>
  );
}

const CONCEPTS: Record<LogoConcept, (p: ConceptProps) => JSX.Element> = {
  a: ConceptA,
  b: ConceptB,
  c: ConceptC,
  d: ConceptD,
  e: ConceptE,
  f: ConceptF,
  g: ConceptG,
  h: ConceptH,
  i: ConceptI,
  j: ConceptJ,
  k: ConceptK,
};

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
  const rawId = useId();
  const gradId = `lg-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const coreFill = colors.gradient ? `url(#${gradId})` : colors.geometry;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {colors.gradient && (
        <defs>
          <linearGradient id={gradId} x1={4} y1={4} x2={28} y2={28} gradientUnits="userSpaceOnUse">
            <stop offset={0} stopColor="#246BFD" />
            <stop offset={1} stopColor="#00C2FF" />
          </linearGradient>
        </defs>
      )}
      <Concept c={colors} simplified={simplified} coreFill={coreFill} />
    </svg>
  );
}

export const LOGO_CONCEPT_LABELS: Record<LogoConcept, string> = {
  a: "Scan Trace",
  b: "Digital Trace",
  c: "Scan Point",
  d: "Pixel Dissolve",
  e: "Circuit Trace",
  f: "Data Density",
  g: "Data Stack",
  h: "Grid Resolve",
  i: "Orbit System",
  j: "Faceted Core",
  k: "Dense Network",
};
