export default function Section({ id, eyebrow, title, intro, children, className = '', tone = 'white' }) {
  const bg = tone === 'soft' ? 'bg-soft' : 'bg-surface';
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`${bg} py-16 md:py-20 ${className}`}>
      <div className="container-x">
        {(eyebrow || title) && (
          <header className="mb-10 max-w-3xl">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            {title && <h2 id={headingId} className="text-2xl font-bold md:text-3xl">{title}</h2>}
            {intro && <p className="mt-4 text-muted">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
