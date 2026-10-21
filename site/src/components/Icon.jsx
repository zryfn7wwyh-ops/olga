import { Briefcase, Building2, Circle, GraduationCap, Lightbulb, MonitorSmartphone, ShieldCheck, Users } from 'lucide-react';

// Иконки в контенте задаются строкой — так конфигурацию можно хранить в CMS.
// Новую иконку достаточно импортировать и добавить в карту.
const map = { Briefcase, Building2, GraduationCap, Lightbulb, MonitorSmartphone, ShieldCheck, Users };

export default function Icon({ name, ...props }) {
  const Cmp = map[name] || Circle;
  return <Cmp aria-hidden="true" {...props} />;
}
