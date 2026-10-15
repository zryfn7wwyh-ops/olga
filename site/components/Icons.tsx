type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconPhone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M5 4h3.5l1.6 4-2.1 1.4a11 11 0 0 0 6.6 6.6l1.4-2.1 4 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.4 16.4 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4Z" />
  </svg>
);
export const IconTelegram = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="m21 4-18 7.2 5.6 2L18 7.5l-7.4 7.3.3 5.2 3-3.6 4.6 3.4L21 4Z" />
  </svg>
);
export const IconMail = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
);
export const IconRoute = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <circle cx="6" cy="18" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
  </svg>
);
export const IconClose = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconArrowLeft = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M19 12H5m6-6-6 6 6 6" />
  </svg>
);
export const IconArrowRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);
export const IconPlus = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconExpand = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
  </svg>
);
