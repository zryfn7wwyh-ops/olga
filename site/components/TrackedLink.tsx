"use client";

import { trackGoal, type Goal, type GoalParams } from "@/lib/analytics";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { goal: Goal; params?: GoalParams };

/** Обычная ссылка с отправкой цели в Метрику по клику. */
export function TrackedLink({ goal, params, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackGoal(goal, params);
        onClick?.(e);
      }}
    />
  );
}
