import { UserRound } from 'lucide-react';

// Карточка преподавателя: фото (или силуэт, если фото нет) и сведения.
export default function TeacherCard({ t }) {
  const rows = [
    ['Образование', t.education],
    ['Повышение квалификации', t.qualification],
    ['Опыт работы', t.experience],
  ];
  return (
    <article className="grid gap-6 border border-line p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
      {t.photo ? (
        <img src={t.photo} alt={`Фотография: ${t.name}`} width="480" height="600" loading="lazy" className="aspect-[4/5] w-full max-w-[240px] bg-soft object-cover sm:max-w-none" />
      ) : (
        <span className="grid aspect-[4/5] w-full max-w-[240px] place-items-center bg-soft text-muted sm:max-w-none">
          <UserRound aria-hidden="true" className="h-16 w-16" />
        </span>
      )}
      <div className="min-w-0">
        <h3 className="text-lg font-bold md:text-xl">{t.name}</h3>
        <p className="mt-1 text-ink">{t.position}</p>
        <dl className="mt-5 divide-y divide-line border-t border-line text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 md:grid-cols-[200px_minmax(0,1fr)] md:gap-4">
              <dt className="font-semibold text-navy">{label}</dt>
              <dd className="text-ink">
                {Array.isArray(value) ? (
                  <ul className="list-disc space-y-1 pl-5">{value.map((v) => <li key={v}>{v}</li>)}</ul>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
