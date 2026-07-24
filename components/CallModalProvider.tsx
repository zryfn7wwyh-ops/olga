"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CallModal } from "@/components/CallModal";
import { trackGoal, type AnalyticsPlacement } from "@/lib/analytics";

type CallModalContextValue = {
  openModal: (placement: AnalyticsPlacement) => void;
};

const CallModalContext = createContext<CallModalContextValue | null>(null);

export function CallModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<AnalyticsPlacement>("hero");

  const openModal = useCallback((nextPlacement: AnalyticsPlacement) => {
    setPlacement(nextPlacement);
    setIsOpen(true);
    trackGoal("call_modal_open", { placement: nextPlacement });
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ openModal }), [openModal]);

  return (
    <CallModalContext.Provider value={value}>
      {children}
      <CallModal isOpen={isOpen} onClose={closeModal} placement={placement} />
    </CallModalContext.Provider>
  );
}

export function useCallModal() {
  const ctx = useContext(CallModalContext);
  if (!ctx) {
    throw new Error("useCallModal must be used within CallModalProvider");
  }
  return ctx;
}
