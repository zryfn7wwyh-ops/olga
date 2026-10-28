import { forwardRef, type ReactNode } from "react";
import s from "./ui.module.css";

type Props = { tone: "error" | "success" | "idle"; title?: ReactNode; children?: ReactNode; testMode?: boolean };

/**
 * Живой регион статуса формы. Всегда присутствует в DOM, чтобы скринридеры
 * объявляли изменения; пустой — скрыт.
 */
export const FormStatus = forwardRef<HTMLDivElement, Props>(function FormStatus({ tone, title, children, testMode }, ref) {
  const active = tone !== "idle";
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={active ? `${s.status} ${tone === "error" ? s.statusError : s.statusSuccess}` : s.status}
    >
      {active && (
        <>
          {title && <p className={s.statusTitle}>{title}</p>}
          {children && <p>{children}</p>}
          {testMode && <span className={s.testBadge}>Тестовый режим: заявка сохранена локально</span>}
        </>
      )}
    </div>
  );
});
