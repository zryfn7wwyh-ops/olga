export function RobotScanner() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {/* луч сканирования всего экрана */}
      <div className="absolute inset-x-0 top-0 h-28 animate-hero-sweep bg-gradient-to-b from-transparent via-primary/20 to-transparent sm:h-36" />
      <div className="absolute inset-x-0 top-0 h-[2px] animate-hero-sweep bg-primary/70 shadow-[0_0_18px_4px_rgba(36,107,253,0.55)]" />

      {/* робот: объемный, с 3D-вращением */}
      <div
        className="absolute right-5 top-20 animate-bot-appear sm:right-10 sm:top-16"
        style={{ perspective: "900px" }}
      >
        <div
          className="h-20 w-20 animate-bot-spin3d sm:h-24 sm:w-24"
          style={{ transformStyle: "preserve-3d" }}
        >
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full drop-shadow-[0_16px_24px_rgba(16,42,67,0.4)]"
          >
            <defs>
              <linearGradient id="botHead" x1="0.15" y1="0.1" x2="0.9" y2="0.95">
                <stop offset="0%" stopColor="#eef4ff" />
                <stop offset="45%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--navy)" />
              </linearGradient>
              <linearGradient id="botBody" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor="#4a86ff" />
                <stop offset="60%" stopColor="#1f4fb8" />
                <stop offset="100%" stopColor="var(--navy)" />
              </linearGradient>
              <radialGradient id="botEye" cx="35%" cy="32%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="#0c3aa0" />
              </radialGradient>
              <linearGradient id="botAntenna" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eef4ff" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>

            <ellipse cx="50" cy="93" rx="26" ry="4" fill="var(--navy)" opacity="0.18" />

            <line x1="50" y1="20" x2="50" y2="9" stroke="url(#botAntenna)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="6.5" r="5" fill="url(#botEye)" />

            <rect x="24" y="19" width="52" height="36" rx="13" fill="url(#botHead)" stroke="var(--navy)" strokeWidth="1.5" />
            <rect x="30" y="24" width="40" height="10" rx="5" fill="#ffffff" opacity="0.35" />
            <circle cx="39" cy="38" r="6" fill="url(#botEye)" />
            <circle cx="61" cy="38" r="6" fill="url(#botEye)" />
            <circle cx="37" cy="36" r="1.6" fill="#ffffff" opacity="0.9" />
            <circle cx="59" cy="36" r="1.6" fill="#ffffff" opacity="0.9" />
            <path d="M41 48h18" stroke="var(--navy)" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />

            <rect x="20" y="58" width="60" height="34" rx="14" fill="url(#botBody)" stroke="var(--navy)" strokeWidth="1.5" />
            <rect x="27" y="63" width="46" height="9" rx="4.5" fill="#ffffff" opacity="0.22" />
            <circle cx="50" cy="76" r="8" fill="none" stroke="url(#botEye)" strokeWidth="3" />
            <circle cx="50" cy="76" r="2.6" fill="#ffffff" />

            <path d="M20 66 8 59" stroke="var(--navy)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="7" cy="58" r="3.2" fill="url(#botHead)" />
            <path d="M80 66 92 59" stroke="var(--navy)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="93" cy="58" r="3.2" fill="url(#botHead)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
