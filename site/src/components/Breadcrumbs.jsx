import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items, light = false }) {
  return (
    <nav aria-label="Хлебные крошки" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={light ? 'text-white' : 'text-ink'}>{item.label}</span>
              ) : (
                <>
                  <Link to={item.to} className={`rounded hover:underline ${light ? 'text-white/75 hover:text-white' : 'text-muted hover:text-accent'}`}>
                    {item.label}
                  </Link>
                  <ChevronRight aria-hidden="true" className={`h-4 w-4 ${light ? 'text-white/50' : 'text-muted/60'}`} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
