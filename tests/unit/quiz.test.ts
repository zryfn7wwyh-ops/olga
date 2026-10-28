import { describe, expect, it } from "vitest";
import { isQuizComplete, QUIZ_QUESTIONS, recommendSite } from "@/lib/quiz";

describe("quiz", () => {
  it("keeps three questions in the prototype order", () => {
    expect(QUIZ_QUESTIONS.map((q) => q.title)).toEqual([
      "Для чего в первую очередь нужен сайт?",
      "У вас уже есть действующий сайт?",
      "Когда планируете запуск?",
    ]);
    expect(QUIZ_QUESTIONS.map((q) => q.options.length)).toEqual([4, 3, 3]);
  });

  it.each([
    ["single_service", "landing"],
    ["company", "corporate"],
    ["assortment", "catalog"],
    ["unsure", "unknown"],
  ])("recommends %s → %s", (goal, siteType) => {
    expect(recommendSite({ goal, current: "none", launch: "soon" }).siteType).toBe(siteType);
  });

  it("never mentions a price in recommendations", () => {
    for (const goal of ["single_service", "company", "assortment", "unsure"]) {
      const r = recommendSite({ goal });
      expect(`${r.title} ${r.text}`).not.toMatch(/₽|руб|\d/);
    }
  });

  it("detects completion", () => {
    expect(isQuizComplete({ goal: "company", current: "none" })).toBe(false);
    expect(isQuizComplete({ goal: "company", current: "none", launch: "soon" })).toBe(true);
    expect(isQuizComplete({ goal: "company", current: "none", launch: "bogus" })).toBe(false);
  });
});
