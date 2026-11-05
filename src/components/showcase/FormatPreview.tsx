import s from "./showcase.module.css";

/** Схема страницы для карточек «Виды сайтов». При наведении блоки слегка смещаются. */
export function FormatPreview({ kind }: { kind: "landing" | "corporate" | "catalog" }) {
  return (
    <svg className={s.wf} viewBox="0 0 480 220" aria-hidden="true" focusable="false">
      <rect x="40" y="28" width="400" height="220" />
      {kind === "landing" && (
        <>
          <rect className={`${s.f} ${s.up}`} x="64" y="60" width="176" height="20" />
          <rect className={`${s.f} ${s.up}`} x="64" y="88" width="132" height="20" />
          <rect className={`${s.f} ${s.dn}`} x="64" y="124" width="150" height="6" />
          <rect className={`${s.f} ${s.dn}`} x="64" y="138" width="118" height="6" />
          <rect x="280" y="60" width="136" height="126" />
          <rect className={s.f} x="296" y="76" width="104" height="18" />
          <rect className={s.f} x="296" y="102" width="104" height="18" />
          <rect className={s.a} x="296" y="140" width="104" height="26" />
        </>
      )}
      {kind === "corporate" && (
        <>
          <rect className={s.f} x="64" y="46" width="60" height="6" />
          <rect className={s.f} x="136" y="46" width="60" height="6" />
          <rect className={s.f} x="208" y="46" width="60" height="6" />
          <rect className={`${s.f} ${s.up}`} x="64" y="72" width="280" height="22" />
          <rect className={s.dn} x="64" y="114" width="108" height="84" />
          <rect className={s.dn} x="186" y="114" width="108" height="84" />
          <rect className={s.dn} x="308" y="114" width="108" height="84" />
          <rect className={s.a} x="78" y="128" width="36" height="8" />
          <rect className={s.a} x="200" y="128" width="36" height="8" />
          <rect className={s.a} x="322" y="128" width="36" height="8" />
        </>
      )}
      {kind === "catalog" && (
        <>
          <rect className={`${s.f} ${s.lf}`} x="64" y="52" width="76" height="8" />
          <rect className={`${s.a} ${s.lf}`} x="64" y="70" width="52" height="8" />
          <rect className={`${s.f} ${s.lf}`} x="64" y="88" width="64" height="8" />
          <rect className={`${s.f} ${s.lf}`} x="64" y="106" width="70" height="8" />
          <rect className={`${s.f} ${s.up}`} x="164" y="52" width="76" height="66" />
          <rect className={`${s.f} ${s.up}`} x="252" y="52" width="76" height="66" />
          <rect className={`${s.f} ${s.up}`} x="340" y="52" width="76" height="66" />
          <rect className={`${s.f} ${s.dn}`} x="164" y="132" width="76" height="66" />
          <rect className={`${s.f} ${s.dn}`} x="252" y="132" width="76" height="66" />
          <rect className={`${s.f} ${s.dn}`} x="340" y="132" width="76" height="66" />
        </>
      )}
    </svg>
  );
}
