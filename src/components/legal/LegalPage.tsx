import type { ReactNode } from "react";
import { legal } from "@/content/legal";
import s from "./legal.module.css";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className={s.page}>
      <div className={s.inner}>
        <a className={s.back} href="/">
          ← На главную
        </a>
        <h1 className={s.title}>{title}</h1>
        <p className={s.meta}>Версия документа: {legal.documentVersion}</p>
        {!legal.approved && (
          <div className={s.draft} role="note">
            <strong>Черновик — документ ожидает утверждения.</strong> Текст готовит и утверждает ответственный за обработку
            персональных данных. До утверждения сайт не публикуется в рабочем режиме.
          </div>
        )}
        <div className={s.body}>{children}</div>
      </div>
    </main>
  );
}
