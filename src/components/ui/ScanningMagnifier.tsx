export function ScanningMagnifier() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 animate-magnifier-travel">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
        <span className="absolute inset-0 scale-125 animate-ping rounded-full bg-primary/10 [animation-delay:0.3s]" />

        <div className="glass relative flex h-36 w-36 items-center justify-center rounded-full shadow-card sm:h-44 sm:w-44">
          <div className="absolute inset-[6px] overflow-hidden rounded-full bg-navy/[0.03]">
            <div
              className="absolute inset-0 animate-magnifier-sweep"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(36,107,253,0.65) 30deg, transparent 90deg)",
              }}
            />
          </div>

          {/* медленное встречное вращение — внешний "бленда" сканера */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-magnifier-sweep-slow">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.55"
              strokeWidth="1"
              strokeDasharray="1 6"
              strokeLinecap="round"
            />
          </svg>

          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeOpacity="0.6" strokeWidth="1.4" />
            <circle cx="50" cy="50" r="27" fill="none" stroke="var(--primary)" strokeOpacity="0.4" strokeWidth="0.8" />
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.35"
              strokeWidth="0.8"
              strokeDasharray="2 3"
            />
            <line x1="50" y1="2" x2="50" y2="13" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="50" y1="87" x2="50" y2="98" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="2" y1="50" x2="13" y2="50" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="87" y1="50" x2="98" y2="50" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="20.5" y1="20.5" x2="27" y2="27" stroke="var(--primary)" strokeOpacity="0.7" strokeWidth="1.1" strokeLinecap="round" />
            <line x1="79.5" y1="20.5" x2="73" y2="27" stroke="var(--primary)" strokeOpacity="0.7" strokeWidth="1.1" strokeLinecap="round" />
            <line x1="20.5" y1="79.5" x2="27" y2="73" stroke="var(--primary)" strokeOpacity="0.7" strokeWidth="1.1" strokeLinecap="round" />
            <line x1="79.5" y1="79.5" x2="73" y2="73" stroke="var(--primary)" strokeOpacity="0.7" strokeWidth="1.1" strokeLinecap="round" />
          </svg>

          <span className="relative h-3 w-3 animate-pulse-soft rounded-full bg-primary shadow-[0_0_14px_3px_rgba(36,107,253,0.7)]" />
        </div>

        <span className="absolute -bottom-8 -right-8 h-14 w-3.5 rotate-45 rounded-full bg-navy shadow-card sm:-bottom-10 sm:-right-10 sm:h-[72px] sm:w-4" />
      </div>
    </div>
  );
}
