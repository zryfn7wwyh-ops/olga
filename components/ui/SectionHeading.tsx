type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  id,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDarkTone = tone === "dark";

  return (
    <div className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bronze ${
            isCenter ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-6 bg-bronze" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className={`mt-4 text-3xl leading-tight font-semibold sm:text-4xl ${
          isDarkTone ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            isDarkTone ? "text-paper/75" : "text-text-muted"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
