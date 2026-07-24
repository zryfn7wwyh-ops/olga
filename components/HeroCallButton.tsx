"use client";

import { useCallModal } from "@/components/CallModalProvider";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

export function HeroCallButton() {
  const { openModal } = useCallModal();

  return (
    <Button onClick={() => openModal("hero")} size="lg" icon={<ArrowRightIcon />}>
      Позвонить адвокату
    </Button>
  );
}
