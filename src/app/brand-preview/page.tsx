import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { LogoMark, LOGO_CONCEPT_LABELS, type LogoConcept, type LogoTheme } from "@/components/brand/LogoMark";

export const metadata: Metadata = {
  title: "Brand preview — концепции логотипа",
  robots: { index: false, follow: false },
};

const ROUND1: LogoConcept[] = ["a", "b", "c"];
const ROUND2: LogoConcept[] = ["d", "e", "f", "g", "h"];
const ROUND3: LogoConcept[] = ["i", "j", "k"];

const RATIONALE: Record<LogoConcept, string> = {
  a: "Незамкнутая рамка сканера + 3 data-node + траектория; один узел намеренно выходит за пределы рамки — цифровой след шире того, что компания видит сама.",
  b: "Без рамки: асимметричная угловая траектория из 4 узлов разного веса — уникальная «цифровая сигнатура», а не сеть и не молекула.",
  c: "Максимально лаконичный знак: 2 scanner-corners + центральная data-point + короткая scan-line. Задуман прежде всего под favicon и мелкие размеры.",
  d: "Сплошная форма буквально «рассыпается» на пиксели с одного угла — прямая метафора оцифровки: аналоговый объект становится данными.",
  e: "Трасса печатной платы: прямые углы вместо скруглений, площадки на изгибах — читается как цифровая инфраструктура, а не как контур.",
  f: "Рассеянные точки данных разного размера уплотняются в яркое ядро — сигнал, который постепенно проявляется из шума.",
  g: "Три слоя данных друг над другом, прозрачность убывает вниз, импульс на верхнем — метафора структурированных, накопленных данных.",
  h: "Ровная сетка ячеек, в которой сканер «нашёл» три конкретные — не абстрактная решётка, а результат сканирования матрицы.",
  i: "Ядро в окружении трёх колец сканирования на разных фазах вращения, с узлами на кольцах — многоуровневая система, а не один жест.",
  j: "Гранёное шестиугольное ядро из 6 граней разной яркости, с траекториями данных от вершин — инженерная, «огранённая» сложность.",
  k: "Узел-хаб и шесть спутников с трассами разного веса плюс вторичная связь между двумя из них — карта цифрового следа целиком, не одна линия.",
};

const SIZE_LADDER = [64, 48, 32, 24, 16];
const MONO_THEMES: LogoTheme[] = ["mono-black", "mono-white", "mono-blue"];
const MONO_LABELS: Record<string, string> = {
  "mono-black": "Black",
  "mono-white": "White",
  "mono-blue": "Blue",
};

function ConceptCard({ concept }: { concept: LogoConcept }) {
  return (
    <section className="border-t border-border">
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
  );
}

export default function BrandPreviewPage() {
  return (
    <div className="bg-background pb-24">
      <div className="mx-auto max-w-container px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Внутренняя страница — не индексируется, не влияет на продакшен
        </p>
        <h1 className="font-heading mt-3 max-w-3xl text-3xl font-bold text-navy sm:text-4xl">
          Концепции знака «цифровой след»
        </h1>
        <p className="mt-4 max-w-2xl text-base text-text-secondary">
          Самостоятельный знак нового digital-сервиса — без «Роском Онлайн», без государственной
          символики, без щитов и замков. Идея: сканирование → выявление → анализ цифрового следа
          компании. Текущий продакшен-логотип не менялся — решение о замене принимаете вы.
        </p>
      </div>

      <div className="border-t border-border bg-surface">
        <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Раунд 1 — по исходному ТЗ
          </span>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Лаконичные знаки: тонкая линия, минимум элементов.
          </p>
        </div>
      </div>
      {ROUND1.map((concept) => (
        <ConceptCard key={concept} concept={concept} />
      ))}

      <div className="border-t border-border bg-surface">
        <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Раунд 2 — плотнее и заметнее цифровизация
          </span>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Фидбэк по раунду 1: слишком примитивно. Здесь — знаки с реальным визуальным весом:
            пиксели, трассы платы, поле точек данных, слои, сетка. Каждый строится на буквальном
            образе оцифровки/сканирования, а не на одной тонкой линии, и использует мягкий градиент
            #246BFD → #00C2FF на основной форме (монохром — по-прежнему сплошным цветом).
          </p>
        </div>
      </div>
      {ROUND2.map((concept) => (
        <ConceptCard key={concept} concept={concept} />
      ))}

      <div className="border-t border-border bg-surface">
        <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Раунд 3 — сложный, высокотехнологичный продукт
          </span>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Фидбэк по раунду 2: нужна настоящая сложность, отражающая непростой продукт — не
            больше точек в том же масштабе, а многослойная инженерная конструкция. Здесь — кольца
            сканирования на разных фазах вращения, гранёное ядро с траекториями от вершин, и
            карта из семи узлов разного веса с вторичными связями.
          </p>
        </div>
      </div>
      {ROUND3.map((concept) => (
        <ConceptCard key={concept} concept={concept} />
      ))}

      <div className="mx-auto max-w-container px-4 pt-4 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-xs text-text-secondary">
          Цвета: Primary #246BFD (основная геометрия), Cyan #00C2FF (точечный акцент), Navy #102A43
          и White #FFFFFF (тёмная/светлая версии), опциональный градиент #246BFD → #00C2FF на
          основной форме. SVG сгруппированы по смысловым узлам (ScanCorners / TraceLine / CoreShape /
          Layers / GridField / NodeNN) — готовы к будущей анимации. Исходники раунда 1:{" "}
          <code className="font-mono">/design/logo-concept-a.svg</code>,{" "}
          <code className="font-mono">-b.svg</code>, <code className="font-mono">-c.svg</code>.
          Скажите, какую концепцию берём — тогда доведу выбранную до финальных
          light/dark/monochrome/favicon файлов и подключу в хедер.
        </p>
      </div>
    </div>
  );
}
