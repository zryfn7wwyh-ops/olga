// Абстрактная учебная иллюстрация без изображений людей.
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 400" role="img" aria-label="Абстрактная иллюстрация: учебные материалы и экран с курсом" className="h-auto w-full">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1674B8" />
          <stop offset="1" stopColor="#102B45" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="200" r="170" fill="#ffffff" opacity=".08" />
      <circle cx="390" cy="70" r="40" fill="#1674B8" opacity=".35" />
      <rect x="70" y="70" width="300" height="200" rx="18" fill="#ffffff" />
      <rect x="70" y="70" width="300" height="38" rx="18" fill="#EAF4FC" />
      <rect x="70" y="92" width="300" height="16" fill="#EAF4FC" />
      <circle cx="94" cy="89" r="6" fill="#1674B8" opacity=".5" />
      <circle cx="114" cy="89" r="6" fill="#1674B8" opacity=".3" />
      <rect x="96" y="130" width="140" height="12" rx="6" fill="#102B45" />
      <rect x="96" y="154" width="200" height="8" rx="4" fill="#68788A" opacity=".45" />
      <rect x="96" y="170" width="170" height="8" rx="4" fill="#68788A" opacity=".45" />
      <rect x="96" y="200" width="96" height="34" rx="9" fill="#1674B8" />
      <rect x="276" y="184" width="70" height="60" rx="10" fill="url(#hg1)" />
      <path d="M302 202l20 12-20 12z" fill="#fff" />
      <g transform="translate(250 240)">
        <rect width="170" height="110" rx="14" fill="url(#hg1)" />
        <rect x="18" y="20" width="60" height="8" rx="4" fill="#fff" opacity=".9" />
        <rect x="18" y="36" width="110" height="6" rx="3" fill="#fff" opacity=".5" />
        <rect x="18" y="64" width="134" height="10" rx="5" fill="#fff" opacity=".2" />
        <rect x="18" y="64" width="90" height="10" rx="5" fill="#EAF4FC" />
        <text x="18" y="96" fill="#fff" fontFamily="Inter, sans-serif" fontSize="11" opacity=".8">Прогресс обучения</text>
      </g>
      <g transform="translate(40 250)">
        <rect width="120" height="22" rx="4" fill="#EAF4FC" />
        <rect y="26" width="132" height="22" rx="4" fill="#1674B8" />
        <rect x="6" y="52" width="114" height="22" rx="4" fill="#ffffff" />
      </g>
      <g transform="translate(330 30) rotate(12)">
        <path d="M0 22 40 6l40 16-40 16z" fill="#ffffff" />
        <path d="M16 30v14c0 6 48 6 48 0V30L40 40z" fill="#EAF4FC" />
      </g>
    </svg>
  );
}
