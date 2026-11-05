type Name = "close" | "check" | "menu" | "tick";

const paths: Record<Name, { box: string; d: string; w: number; h: number; sw: number }> = {
  close: { box: "0 0 16 16", d: "M1 1l14 14M15 1L1 15", w: 16, h: 16, sw: 1.5 },
  menu: { box: "0 0 20 14", d: "M0 1h20M0 7h20M0 13h20", w: 20, h: 14, sw: 1.5 },
  check: { box: "0 0 14 14", d: "M1 8l4 4 8-10", w: 14, h: 14, sw: 1.5 },
  tick: { box: "0 0 28 28", d: "M3 15l7 7L25 6", w: 28, h: 28, sw: 2 },
};

export function Icon({ name, className }: { name: Name; className?: string }) {
  const p = paths[name];
  return (
    <svg
      width={p.w}
      height={p.h}
      viewBox={p.box}
      fill="none"
      stroke="currentColor"
      strokeWidth={p.sw}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={p.d} />
    </svg>
  );
}

/** Стрелка «→» для кнопок и ссылок. */
export function Arrow() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <path d="M0 5h16M12 1l4 4-4 4" />
    </svg>
  );
}
