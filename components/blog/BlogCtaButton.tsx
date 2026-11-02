"use client";

import { useCallModal } from "@/components/CallModalProvider";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { AnalyticsPlacement } from "@/lib/analytics";

type BlogCtaButtonProps = {
  label: string;
  placement: AnalyticsPlacement;
  size?: "md" | "lg";
};

export function BlogCtaButton({ label, placement, size = "lg" }: BlogCtaButtonProps) {
  const { openModal } = useCallModal();

  return (
    <Button onClick={() => openModal(placement)} size={size} icon={<ArrowRightIcon />}>
      {label}
    </Button>
  );
}
