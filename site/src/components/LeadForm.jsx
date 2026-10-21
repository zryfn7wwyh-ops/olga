import DemoForm from './DemoForm.jsx';
import { programs } from '../data/programs.js';

export const leadFields = [
  { name: 'name', label: 'Имя', type: 'text', autoComplete: 'name' },
  { name: 'phone', label: 'Телефон', type: 'tel', autoComplete: 'tel', placeholder: '+7 (___) ___-__-__' },
  { name: 'email', label: 'Электронная почта', type: 'email', autoComplete: 'email' },
  { name: 'program', label: 'Программа', type: 'select', options: programs.map((p) => ({ value: p.slug, label: p.title })) },
];

export default function LeadForm({ program = '', compact }) {
  return <DemoForm fields={leadFields} initial={{ program }} compact={compact} />;
}
