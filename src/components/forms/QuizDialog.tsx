"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import { track } from "@/lib/analytics";
import { isQuizComplete, QUIZ_QUESTIONS, recommendSite, type QuizAnswers } from "@/lib/quiz";
import { LeadContactFields } from "./LeadContactFields";
import { SubmitErrorStatus, SuccessPanel } from "./SuccessPanel";
import { useLeadForm } from "./useLeadForm";
import s from "./forms.module.css";

type Props = { open: boolean; onClose: () => void; returnFocusTo: HTMLElement | null };

/** Форма B — квиз из трёх вопросов (source=quiz). */
export function QuizDialog({ open, onClose, returnFocusTo }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      returnFocusTo={returnFocusTo}
      title="Подбор сайта за 3 вопроса"
      description="Ответьте на три вопроса — предложим подходящий формат. Стоимость обсудим отдельно, после уточнения задачи."
    >
      {/* Монтируется заново при каждом открытии — прохождение сбрасывается. */}
      <QuizFlow />
    </Dialog>
  );
}

function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResult, setShowResult] = useState(false);
  const form = useLeadForm("quiz");
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (showResult) resultRef.current?.focus();
    else firstOptionRef.current?.closest("fieldset")?.querySelector<HTMLInputElement>("input:checked, input")?.focus();
  }, [step, showResult]);

  if (form.phase === "success") {
    return (
      <SuccessPanel
        form={form}
        text="Мы свяжемся с вами по указанному контакту, чтобы обсудить задачу и подготовить предложение по сайту."
      />
    );
  }

  if (showResult && isQuizComplete(answers)) {
    const reco = recommendSite(answers);
    return (
      <div className={s.form}>
        <div className={s.recommendation} ref={resultRef} tabIndex={-1} aria-live="polite">
          <p className={s.recoLabel}>Предварительная рекомендация</p>
          <h3 className={s.recoTitle}>{reco.title}</h3>
          <p>{reco.text}</p>
          <ul className={s.answers} aria-label="Ваши ответы">
            {QUIZ_QUESTIONS.map((q) => (
              <li key={q.id}>— {q.options.find((o) => o.value === answers[q.id])?.label}</li>
            ))}
          </ul>
        </div>

        <form
          ref={form.formRef}
          className={s.form}
          noValidate
          aria-label="Контакты для предложения по сайту"
          onSubmit={(e) => {
            e.preventDefault();
            void form.submit({ answers: { ...answers, recommendation: reco.siteType } });
          }}
        >
          <LeadContactFields form={form} idPrefix="quiz" />
          <SubmitErrorStatus form={form} />
          <div className={s.quizNav}>
            <Button
              variant="ghost"
              onClick={() => {
                setShowResult(false);
                setStep(0);
              }}
              disabled={form.submitting}
            >
              Изменить ответы
            </Button>
            <Button type="submit" loading={form.submitting} disabled={form.submitting}>
              {form.submitting ? "Отправляем…" : "Получить предложение по сайту"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[step];
  const value = answers[q.id] ?? null;
  const last = step === QUIZ_QUESTIONS.length - 1;

  return (
    <div className={s.form}>
      <div className={s.progress}>
        <div className={s.progressMeta}>
          <span aria-hidden="true">Вопрос</span>
          <span>
            <span className="visually-hidden">Вопрос </span>
            {step + 1}/{QUIZ_QUESTIONS.length}
          </span>
        </div>
        <div className={s.progressTrack} aria-hidden="true">
          {QUIZ_QUESTIONS.map((item, i) => (
            <span key={item.id} data-done={i <= step} />
          ))}
        </div>
      </div>

      <RadioCardGroup
        key={q.id}
        ref={firstOptionRef}
        idPrefix={`quiz-${q.id}`}
        name={`quiz-${q.id}`}
        legend={<span className={s.question}>{q.title}</span>}
        options={q.options}
        value={value}
        onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
        columns={1}
        size="lg"
      />

      <div className={s.quizNav}>
        <Button variant="secondary" onClick={() => setStep((n) => n - 1)} disabled={step === 0}>
          <Icon name="back" size={18} />
          Назад
        </Button>
        <Button
          disabled={!value}
          onClick={() => {
            track("quiz_step_complete", { step: step + 1, question: q.id, answer: value });
            if (last) {
              setShowResult(true);
              track("quiz_result_view", { recommendation: recommendSite(answers).siteType });
            } else setStep((n) => n + 1);
          }}
        >
          {last ? "Показать рекомендацию" : "Далее"}
          <Icon name="arrow" size={18} />
        </Button>
      </div>
    </div>
  );
}
