import s from "./showcase.module.css";

/** Схематичное UI-превью формата сайта для карточек «Виды сайтов». */
export function FormatPreview({ kind }: { kind: "landing" | "corporate" | "catalog" }) {
  return (
    <div className={s.mini}>
      <div className={s.miniBar}>
        <i />
        <i />
        <i />
      </div>
      <div className={s.miniBody}>{kind === "landing" ? <Landing /> : kind === "corporate" ? <Corporate /> : <Catalog />}</div>
    </div>
  );
}

const Sk = ({ w, h, tone }: { w: string; h?: string; tone?: "ink" | "accent" | "soft" }) => (
  <span
    className={`${s.sk} ${tone === "ink" ? s.skInk : tone === "accent" ? s.skAccent : tone === "soft" ? s.skSoft : ""}`}
    style={{ width: w, height: h }}
  />
);

function Landing() {
  return (
    <div className={s.row} style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start" }}>
      <div className={s.row}>
        <Sk w="90%" h="5cqw" tone="ink" />
        <Sk w="70%" h="5cqw" tone="ink" />
        <Sk w="80%" />
        <Sk w="60%" />
      </div>
      <div className={s.row} style={{ padding: "3cqw", border: "1px solid var(--color-line)", borderRadius: "2cqw" }}>
        <Sk w="60%" />
        <Sk w="100%" h="5cqw" tone="soft" />
        <Sk w="100%" h="5cqw" tone="soft" />
        <Sk w="100%" h="5cqw" tone="accent" />
      </div>
    </div>
  );
}

function Corporate() {
  return (
    <div className={s.row}>
      <div className={s.row} style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <Sk w="80%" />
        <Sk w="70%" />
        <Sk w="80%" />
        <Sk w="60%" />
      </div>
      <Sk w="75%" h="5cqw" tone="ink" />
      <Sk w="50%" />
      <div className={s.row} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={s.row} style={{ padding: "3cqw", background: "var(--color-paper)", borderRadius: "2cqw" }}>
            <Sk w="40%" tone="accent" />
            <Sk w="90%" />
            <Sk w="70%" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Catalog() {
  return (
    <div className={s.row} style={{ gridTemplateColumns: "1fr 3fr", alignItems: "start" }}>
      <div className={s.row}>
        <Sk w="80%" tone="ink" />
        <Sk w="70%" />
        <Sk w="60%" tone="accent" />
        <Sk w="75%" />
        <Sk w="50%" />
      </div>
      <div className={s.row} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={s.row} style={{ gap: "2cqw" }}>
            <span className={s.sk} style={{ height: "12cqw", borderRadius: "1.5cqw" }} />
            <Sk w="80%" />
          </div>
        ))}
      </div>
    </div>
  );
}
