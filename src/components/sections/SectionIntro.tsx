import type { ReactNode } from "react";
import { Rich } from "@/components/ui/Rich";
import s from "./sections.module.css";

type Props = {
  id: string;
  index?: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  titleId?: string;
  /** split — метка слева, заголовок справа; stacked — всё в колонку (боковые колонки). */
  layout?: "split" | "stacked";
  size?: "md" | "sm";
};

/** Заголовок смыслового блока. Обёртка — motion-слот section-intro. */
export function SectionIntro({ id, index, kicker, title, lead, titleId, layout = "split", size = "md" }: Props) {
  const kick = (
    <p className={`mono ${s.kicker}`}>
      {index && <b>{index}</b>}
      <span>{kicker}</span>
    </p>
  );
  const body = (
    <>
      <h2 className={`${s.h2} ${size === "sm" ? s.h2sm : ""}`} id={titleId}>
        {title}
      </h2>
      {lead && <p className={s.lead}>{typeof lead === "string" ? <Rich text={lead} /> : lead}</p>}
    </>
  );
  return layout === "split" ? (
    <div className={s.intro} data-motion="section-intro" data-motion-id={`section-intro-${id}`}>
      <div>{kick}</div>
      <div className={s.introBody}>{body}</div>
    </div>
  ) : (
    <div className={s.introStacked} data-motion="section-intro" data-motion-id={`section-intro-${id}`}>
      {kick}
      {body}
    </div>
  );
}
