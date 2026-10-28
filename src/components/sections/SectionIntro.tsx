import type { ReactNode } from "react";
import s from "./sections.module.css";

type Props = { id: string; index?: string; kicker: string; title: ReactNode; lead?: ReactNode; titleId?: string };

/** Заголовок смыслового блока. Обёртка — motion-слот section-intro. */
export function SectionIntro({ id, index, kicker, title, lead, titleId }: Props) {
  return (
    <div className={s.intro} data-motion="section-intro" data-motion-id={`section-intro-${id}`}>
      <div data-motion-layer>
        <p className={s.kicker}>
          {index && <span className={s.kickerIndex}>{index}</span>}
          {kicker}
        </p>
      </div>
      <h2 className={s.h2} id={titleId}>
        {title}
      </h2>
      {lead && <p className={s.lead}>{lead}</p>}
    </div>
  );
}
