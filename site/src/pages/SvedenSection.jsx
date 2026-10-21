import { useParams } from 'react-router-dom';
import SvedenContent from '../components/SvedenContent.jsx';
import NotFound from './NotFound.jsx';
import { getSvedenSection } from '../data/sveden.js';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function SvedenSection() {
  const section = getSvedenSection(useParams().slug);
  usePageMeta({ title: section?.title || 'Страница не найдена' });
  if (!section) return <NotFound embedded />;
  return <SvedenContent blocks={section.blocks} />;
}
