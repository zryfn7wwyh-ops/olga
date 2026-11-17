"use client";

import { useEffect, useState } from "react";
import { trackGoal } from "@/lib/analytics";
import { EyeIcon } from "@/components/ui/icons";

type ViewCounterProps = {
  slug: string;
};

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    trackGoal("article_open", { id: slug });

    let cancelled = false;

    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((res) => res.json())
      .then((data: { views?: number }) => {
        if (!cancelled && typeof data.views === "number") setViews(data.views);
      })
      .catch(() => {
        // счётчик недоступен — просто не показываем его
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      <EyeIcon className="h-4 w-4 text-bronze" />
      {views}
    </span>
  );
}
