"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import type { SiteType } from "@/lib/leads/schema";
import { ConsultationDialog } from "./ConsultationDialog";
import { QuizDialog } from "./QuizDialog";

type HeroSiteType = Exclude<SiteType, "other">;

type Ctx = {
  siteType: HeroSiteType;
  setSiteType: (t: HeroSiteType) => void;
  /** Предвыбор типа в Hero-форме, скролл к #calc и фокус на поле контакта. */
  requestEstimate: (t?: HeroSiteType) => void;
  estimateContactRef: React.RefObject<HTMLInputElement | null>;
  openQuiz: (trigger: HTMLElement) => void;
  openConsultation: (trigger: HTMLElement) => void;
};

const LeadUIContext = createContext<Ctx | null>(null);

export function useLeadUI() {
  const ctx = useContext(LeadUIContext);
  if (!ctx) throw new Error("useLeadUI must be used inside <LeadUIProvider>");
  return ctx;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function LeadUIProvider({ children }: { children: ReactNode }) {
  const [siteType, setSiteTypeState] = useState<HeroSiteType>("unknown");
  const [quizTrigger, setQuizTrigger] = useState<HTMLElement | null>(null);
  const [consultTrigger, setConsultTrigger] = useState<HTMLElement | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const estimateContactRef = useRef<HTMLInputElement | null>(null);

  const setSiteType = useCallback((t: HeroSiteType) => {
    setSiteTypeState(t);
    track("site_type_select", { site_type: t });
  }, []);

  const requestEstimate = useCallback(
    (t?: HeroSiteType) => {
      if (t) setSiteType(t);
      const target = document.getElementById("calc");
      target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#calc");
      // Фокус после рендера; preventScroll — чтобы не сбить плавную прокрутку.
      requestAnimationFrame(() => estimateContactRef.current?.focus({ preventScroll: true }));
    },
    [setSiteType],
  );

  const openQuiz = useCallback((trigger: HTMLElement) => {
    setQuizTrigger(trigger);
    setQuizOpen(true);
    track("quiz_open");
  }, []);

  const openConsultation = useCallback((trigger: HTMLElement) => {
    setConsultTrigger(trigger);
    setConsultOpen(true);
    track("pdn_consultation_open");
  }, []);

  const value = useMemo(
    () => ({ siteType, setSiteType, requestEstimate, estimateContactRef, openQuiz, openConsultation }),
    [siteType, setSiteType, requestEstimate, openQuiz, openConsultation],
  );

  return (
    <LeadUIContext.Provider value={value}>
      {children}
      <QuizDialog open={quizOpen} onClose={() => setQuizOpen(false)} returnFocusTo={quizTrigger} />
      <ConsultationDialog open={consultOpen} onClose={() => setConsultOpen(false)} returnFocusTo={consultTrigger} />
    </LeadUIContext.Provider>
  );
}
