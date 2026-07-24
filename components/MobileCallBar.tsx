"use client";

import { useCallModal } from "@/components/CallModalProvider";
import { PhoneIcon } from "@/components/ui/icons";

export function MobileCallBar() {
  const { openModal } = useCallModal();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden"
      role="region"
      aria-label="Быстрый звонок адвокату"
    >
      <button
        type="button"
        onClick={() => openModal("mobile_call_bar")}
        className="flex w-full items-center justify-center gap-2 px-4 py-3.5 text-base font-semibold text-paper bg-ink active:bg-emerald"
      >
        <PhoneIcon className="h-5 w-5" />
        Позвонить адвокату
      </button>
    </div>
  );
}
