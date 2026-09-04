export function RobotScanner() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {/* луч сканирования всего экрана */}
      <div className="absolute inset-x-0 top-0 h-28 animate-hero-sweep bg-gradient-to-b from-transparent via-primary/20 to-transparent sm:h-36" />
      <div className="absolute inset-x-0 top-0 h-[2px] animate-hero-sweep bg-primary/70 shadow-[0_0_18px_4px_rgba(36,107,253,0.55)]" />

      {/* робот */}
      <div className="absolute right-5 top-20 animate-bot-appear sm:right-10 sm:top-16">
        <div className="glass flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 via-white/40 to-transparent shadow-card sm:h-20 sm:w-20">
          <svg viewBox="0 0 100 100" className="h-10 w-10 sm:h-12 sm:w-12">
            <line x1="50" y1="20" x2="50" y2="10" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="7" r="4.5" fill="var(--primary)" />
            <rect x="26" y="20" width="48" height="34" rx="11" fill="none" stroke="var(--navy)" strokeWidth="3.5" />
            <circle cx="40" cy="37" r="4.5" fill="var(--primary)" />
            <circle cx="60" cy="37" r="4.5" fill="var(--primary)" />
            <path d="M40 47h20" stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="22" y="58" width="56" height="32" rx="13" fill="none" stroke="var(--navy)" strokeWidth="3.5" />
            <circle cx="50" cy="74" r="7" fill="none" stroke="var(--primary)" strokeWidth="2.6" />
            <circle cx="50" cy="74" r="2.4" fill="var(--primary)" />
            <line x1="22" y1="66" x2="10" y2="60" stroke="var(--navy)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="78" y1="66" x2="90" y2="60" stroke="var(--navy)" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
