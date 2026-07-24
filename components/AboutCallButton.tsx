"use client";

import { useCallModal } from "@/components/CallModalProvider";
import { Button } from "@/components/ui/Button";

export function AboutCallButton() {
  const { openModal } = useCallModal();

  return (
    <Button onClick={() => openModal("about")} size="lg">
      Позвонить Аните Георгиевне
    </Button>
  );
}
