import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import { FieldsTable } from '../components/InfoTable.jsx';
import { getSvedenSection } from '../data/sveden.js';
import { usePageMeta } from '../lib/usePageMeta.js';

// Контакты дублируются из подраздела «Основные сведения» — единый источник данных.
const CONTACT_PROPS = ['fullName', 'address', 'addressPlace', 'workTime', 'telephone', 'email'];

export default function Contacts() {
  usePageMeta({ title: 'Контактная информация' });
  const rows = getSvedenSection('common').blocks[0].rows.filter((r) => CONTACT_PROPS.includes(r.prop));
  return (
    <>
      <PageTitle title="Контактная информация" crumbs={[{ label: 'Главная', to: '/' }, { label: 'Контакты' }]} />
      <div className="container-x max-w-4xl py-8 md:py-10">
        <FieldsTable rows={rows} caption="Контактная информация" />
        <p className="mt-4 text-sm text-muted">
          Сведения приведены по подразделу <Link to="/sveden/common" className="link">«Основные сведения»</Link>.
        </p>
      </div>
    </>
  );
}
