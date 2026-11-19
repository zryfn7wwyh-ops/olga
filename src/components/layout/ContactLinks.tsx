"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";

/** Выводит только реально заданные контакты. Пустые значения не показываются. */
export function ContactLinks() {
  const { phone, email, messengerUrl, messengerLabel } = site.contacts;
  if (!phone && !email && !messengerUrl) return null;
  return (
    <ul className="space-y-2">
      {phone && (
        <li>
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            onClick={() => track("phone_click", { place: "footer" })}
            className="inline-flex min-h-10 items-center gap-2.5 text-ivory hover:text-gold-soft"
          >
            <Phone className="size-4 text-gold-soft" strokeWidth={1.5} aria-hidden="true" />
            {phone}
          </a>
        </li>
      )}
      {messengerUrl && (
        <li>
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("messenger_click", { place: "footer" })}
            className="inline-flex min-h-10 items-center gap-2.5 text-ivory hover:text-gold-soft"
          >
            <MessageCircle className="size-4 text-gold-soft" strokeWidth={1.5} aria-hidden="true" />
            {messengerLabel}
          </a>
        </li>
      )}
      {email && (
        <li>
          <a href={`mailto:${email}`} className="inline-flex min-h-10 items-center gap-2.5 text-ivory hover:text-gold-soft">
            <Mail className="size-4 text-gold-soft" strokeWidth={1.5} aria-hidden="true" />
            {email}
          </a>
        </li>
      )}
    </ul>
  );
}
