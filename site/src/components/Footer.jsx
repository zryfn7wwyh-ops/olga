import { org } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-soft text-navy">
      <div className="container-x py-6 text-sm">
        <p className="font-semibold">{org.logo}</p>
        <p className="mt-1 text-muted">Сведения об образовательной деятельности. Прототип — данные будут заполнены после согласования.</p>
      </div>
    </footer>
  );
}
