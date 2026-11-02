"use client";

import { useEffect } from "react";
import { trackGoal } from "@/lib/analytics";

type ArticleViewTrackerProps = {
  slug: string;
};

export function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    trackGoal("article_open", { id: slug });
  }, [slug]);

  return null;
}
