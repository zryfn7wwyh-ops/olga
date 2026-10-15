"use client";

import { contacts } from "@/data/contacts";
import { CTAButton } from "./ContactModal";
import { TrackedLink } from "./TrackedLink";
import { IconPhone } from "./Icons";

/** Фиксированная нижняя CTA-панель на мобильных. */
export function MobileCTA() {
  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-slate-2 bg-ink/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <TrackedLink
          goal="phone_click"
          params={{ placement: "mobile_bar" }}
          href={contacts.phone.href}
          className="btn btn-primary !min-h-12 flex-1 !px-4"
        >
          <IconPhone className="h-[18px] w-[18px]" /> Позвонить Антону
        </TrackedLink>
        <CTAButton placement="mobile_bar" className="btn btn-ghost-dark !min-h-12 !px-4 text-[14px]">
          Обсудить
        </CTAButton>
      </div>
    </div>
  );
}
