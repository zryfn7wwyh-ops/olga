import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { LogoMark, LOGO_CONCEPT_LABELS, type LogoConcept, type LogoTheme } from "@/components/brand/LogoMark";

export const metadata: Metadata = {
  title: "Brand preview — концепции логотипа",
  robots: { index: false, follow: false },
};

const CONCEPTS: LogoConcept[] = ["a", "b", "c"];

const RATIONALE: Record<LogoConcept, string> = {
  a: "Приоритетная концепция. Незамкнутая рамка сканера + 3 data-node + траектория; один узел намеренно выходит за пределы рамки — цифровой след шире того, что компания видит сама.",
  b: "Без рамки: асимметричная угловая траектория из 4 узлов разного веса — уникальная «цифровая сигнатура», а не сеть и не молекула.",
  c: "Максимально лаконичный знак: 2 scanner-corners + центральная data-point + короткая scan-line. Задуман прежде всего под favicon и мелкие размеры.",
};

const SIZE_LADDER = [64, 48, 32, 24, 16];
const MONO_THEMES: LogoTheme[] = ["mono-black", "mono-white", "mono-blue"];
const MONO_LABELS: Record<string, string> = {
  "mono-black": "Black",
  "mono-white": "White",
  "mono-blue": "Blue",
};

export default function BrandPreviewPage() {
  return (
    <div className="bg-background pb-24">
      <div className="mx-auto max-w-container px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Внутренняя страница — не индексируется, не влияет на продакшен
        </p>
        <h1 className="font-heading mt-3 max-w-3xl text-3xl font-bold text-navy sm:text-4xl">
          Три концепции знака «цифровой след»
        </h1>
        <p className="mt-4 max-w-2xl text-base text-text-secondary">
          Самостоятельный знак нового digital-сервиса — без «Роском Онлайн», без государственной
          символики, без щитов и замков. Идея: сканирование → выявление → анализ цифрового следа
          компании. Ниже — три независимых концепции (не вариации одной), каждая во всех рабочих
          размерах, в monochrome и внутри реального хедера. Текущий продакшен-логотип не менялся —
          решение о замене принимаете вы.
        </p>
      </div>

      {CONCEPTS.map((concept) => (
        <section key={concept} className="border-t border-border">
          <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
                Концепция {concept.toUpperCase()}
              </span>
              <h2 className="font-heading text-2xl font-bold text-navy">{LOGO_CONCEPT_LABELS[concept]}</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">{RATIONALE[concept]}</p>

            {/* Крупный превью на светлом и тёмном фоне */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-center rounded-card border border-border bg-surface py-14">
                <LogoMark concept={concept} theme="light" size={96} />
              </div>
              <div className="flex items-center justify-center rounded-card bg-navy py-14">
                <LogoMark concept={concept} theme="dark" size={96} />
              </div>
            </div>

            {/* Лесенка размеров */}
            <div className="mt-4 flex flex-wrap items-end gap-6 rounded-card border border-border bg-surface p-5">
              {SIZE_LADDER.map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <LogoMark concept={concept} theme="light" size={size} />
                  <span className="font-mono text-[11px] text-text-secondary">{size}px</span>
                </div>
              ))}
              <div className="h-10 w-px bg-border" aria-hidden="true" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[22%] bg-navy">
                  <LogoMark concept={concept} theme="dark" size={18} simplified />
                </div>
                <span className="font-mono text-[11px] text-text-secondary">favicon 16px</span>
              </div>
            </div>

            {/* Monochrome */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {MONO_THEMES.map((theme) => (
                <div
                  key={theme}
                  className={`flex flex-col items-center gap-3 rounded-card border border-border py-8 ${
                    theme === "mono-white" ? "bg-navy" : "bg-surface"
                  }`}
                >
                  <LogoMark concept={concept} theme={theme} size={44} />
                  <span className="text-xs font-semibold text-text-secondary">{MONO_LABELS[theme]}</span>
                </div>
              ))}
            </div>

            {/* В реальном хедере */}
            <div className="mt-4 overflow-hidden rounded-card border border-border">
              <Header logoOverride={<LogoMark concept={concept} theme="light" size={32} />} />
              <div className="bg-background px-4 py-3 text-xs text-text-secondary sm:px-6 lg:px-8">
                Реальный хедер лендинга — тот же компонент, только знак подменён.
              </div>
            </div>
          </div>
        </section>
      ))}

      <div className="mx-auto max-w-container px-4 pt-4 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-xs text-text-secondary">
          Цвета: Primary #246BFD (основная геометрия), Cyan #00C2FF (точечный акцент), Navy #102A43
          и White #FFFFFF (тёмная/светлая версии). SVG сгруппированы как ScanCorners / TraceLine /
          NodeNN — готовы к будущей анимации (corners → trace-line → nodes → pulse). Исходники
          концепций: <code className="font-mono">/design/logo-concept-a.svg</code>,{" "}
          <code className="font-mono">-b.svg</code>, <code className="font-mono">-c.svg</code>.
          Скажите, какую концепцию берём — тогда доведу выбранную до финальных
          light/dark/monochrome/favicon файлов и подключу в хедер.
        </p>
      </div>
    </div>
  );
}
