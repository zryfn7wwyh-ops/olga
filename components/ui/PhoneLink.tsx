"use client";

import type { AnchorHTMLAttributes } from "react";
import { contacts } from "@/data/contacts";
import { trackGoal, type AnalyticsPlacement } from "@/lib/analytics";

type PhoneLinkProps = {
  placement: AnalyticsPlacement;
  children?: React.ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">;

export function PhoneLink({ placement, children, className = "", ...rest }: PhoneLinkProps) {
  return (
    <a
      href={`tel:${contacts.phone}`}
      onClick={() => trackGoal("phone_click", { placement })}
      className={className}
      {...rest}
    >
      {children ?? contacts.phoneDisplay}
    </a>
  );
}
